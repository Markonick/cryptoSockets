import typing, time
from typing import Optional
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json, os, asyncio, websockets
from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
import asyncpg
from aiokafka import AIOKafkaProducer
from aiokafka.errors import LeaderNotAvailableError

app = FastAPI()
SCHEMA = os.environ.get("SCHEMA")
KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")
print(SCHEMA)
print(KAFKA_ADVERTISED_HOST_NAME)
print(KAFKA_CREATE_TOPICS)

async def get_binance_ticker_async(symbol: str) -> None:
    subscribe = json.dumps({"method": "SUBSCRIBE", "params": [f"{symbol}@ticker"], "id": 1})
    binance_address = "wss://stream.binance.com:9443/ws"
    async with websockets.connect(binance_address) as websocket:
        await websocket.send(subscribe)    
        while True:
            data = await websocket.recv()
            data = json.loads(data)
            # print('\n', data)
            if 'result' not in data:
                # print(data)
                # await cryptodb_insert(data)
                await produce(data)
                # await conn.fetch(get_insert_to_tick_query(data))
                
async def produce(data):

    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME)

    # get cluster layout and initial topic/partition leadership information
    await producer.start()
    try:
        # produce message
        value_json = json.dumps(data).encode('utf-8')
        print(KAFKA_CREATE_TOPICS)
        await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
    except LeaderNotAvailableError:
        time.sleep(1)
        value_json = json.dumps(data).encode('utf-8')
        await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
    finally:
        # wait for all pending messages to be delivered or expire.
        await producer.stop()

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(get_binance_ticker_async('btcusdt'))