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
KAFKA_TICKER_TOPIC = os.environ.get("KAFKA_TICKER_TOPIC")
KAFKA_KLINES_TOPIC = os.environ.get("KAFKA_KLINES_TOPIC")
API_BASE_URL = os.environ.get("API_BASE_URL")


loop = asyncio.get_event_loop()

@app.get("/")
def read_root() -> str:
    return {"Hello": "Cryptos"}

@app.get(f"{API_BASE_URL}/klines")
async def get_klines(symbol: str) -> str:
    topic = KAFKA_KLINES_TOPIC
    print(symbol)
    await consume_message(topic, symbol)
 
@app.websocket("/ws/tickers/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str) -> None:
    await websocket.accept()
    msg = {"Message: ": "connected"}
    await websocket.send_json(msg)
    topic = KAFKA_TICKER_TOPIC
    recv_mesg = await consume_message(topic, symbol)
    await websocket.send_text(recv_mesg)

async def consume_message(topic, symbol=None) -> None:
    loop = asyncio.get_event_loop()
    consumer = AIOKafkaConsumer(
        topic,
        loop=loop,
        bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME,
        enable_auto_commit=False,
    )

    await consumer.start()

    print('Kafka Consumer started .............')
    try:
        # Consume messages
        async for msg in consumer:
            decoded_msg = msg.value.decode("utf-8")
            json_msg = json.loads(decoded_msg)
            # print(json_msg["s"])
            if json_msg["s"].lower() == symbol.lower():
                return decoded_msg
                # if websocket:
                #     await websocket.send_text(msg.value.decode("utf-8"))
                # else:
                #     return msg.value.decode("utf-8")
                    # return decoded_msg
    except LeaderNotAvailableError:
        time.sleep(1)
        async for msg in consumer:
            decoded_msg = msg.value.decode("utf-8")
            json_msg = json.loads(decoded_msg)
            print(json_msg["s"])
            if json_msg["s"].lower() == symbol.lower():
                return decoded_msg
    except Exception as e:
        print(e)
    finally:
        # Will leave consumer group; perform autocommit if enabled.
        await consumer.stop()