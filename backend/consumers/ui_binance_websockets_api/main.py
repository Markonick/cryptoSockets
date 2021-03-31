import typing, time
from typing import Optional, Any
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json, os, asyncio
from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
import asyncpg
from aiokafka import AIOKafkaConsumer
from aiokafka.errors import LeaderNotAvailableError
from starlette.endpoints import WebSocketEndpoint
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")
print(KAFKA_ADVERTISED_HOST_NAME)
print(KAFKA_CREATE_TOPICS)


loop = asyncio.get_event_loop()

async def consume(consumer, topic_name) -> None:
    async for msg in consumer:
        return msg.value.decode()

@app.get("/")
def read_root() -> None:
    return {"Hello": "World"}

@app.websocket("/ws/klines/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str) -> None:
    await websocket.accept()
    msg = {"Message: ": "connected"}
    await websocket.send_json(msg)
    
    loop = asyncio.get_event_loop()
    consumer = AIOKafkaConsumer(
        KAFKA_CREATE_TOPICS,
        loop=loop,
        bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME,
        enable_auto_commit=False,
    )

    await consumer.start()
    counter = 0
    print('Kafka Consumer started .............')
    try:
        # Consume messages
        async for msg in consumer:
            decoded_msg = json.loads(msg.value.decode("utf-8"))
            print(decoded_msg["s"])
            print(symbol.lower())
            if decoded_msg["s"].lower() == symbol.lower():
                await websocket.send_text(msg.value.decode("utf-8"))
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("KLINE")
                print("websocket.send_text(msg.value): ","SENT!!!!!")
    except LeaderNotAvailableError:
        time.sleep(1)
        async for msg in consumer:
            decoded_msg = msg.value.decode("utf-8")
            if decoded_msg["s"].lower() == symbol.lower():
                await websocket.send_text(decoded_msg)
                print("websocket.send_text(msg.value): ","SENT!!!!!")
    finally:
        # Will leave consumer group; perform autocommit if enabled.
        await consumer.stop()
 
@app.websocket("/ws/tickers/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str) -> None:
    await websocket.accept()
    msg = {"Message: ": "connected"}
    await websocket.send_json(msg)
    
    loop = asyncio.get_event_loop()
    consumer = AIOKafkaConsumer(
        KAFKA_CREATE_TOPICS,
        loop=loop,
        bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME,
        enable_auto_commit=False,
    )

    await consumer.start()
    counter = 0
    print('Kafka Consumer started .............')
    try:
        # Consume messages
        async for msg in consumer:
            decoded_msg = json.loads(msg.value.decode("utf-8"))
            print(decoded_msg["s"])
            print(symbol.lower())
            if decoded_msg["s"].lower() == symbol.lower():
                await websocket.send_text(msg.value.decode("utf-8"))
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("TICKER")
                print("websocket.send_text(msg.value): ","SENT!!!!!")
    except LeaderNotAvailableError:
        time.sleep(1)
        async for msg in consumer:
            decoded_msg = msg.value.decode("utf-8")
            if decoded_msg["s"].lower() == symbol.lower():
                await websocket.send_text(decoded_msg)
                print("websocket.send_text(msg.value): ","SENT!!!!!")
    finally:
        # Will leave consumer group; perform autocommit if enabled.
        await consumer.stop()
