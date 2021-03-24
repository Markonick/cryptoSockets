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

KAFKA_HOST = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")
print(KAFKA_HOST)
print(KAFKA_CREATE_TOPICS)


loop = asyncio.get_event_loop()
            

# # async def consume() -> None:
# #     consumer = AIOKafkaConsumer(
# #         KAFKA_CREATE_TOPICS,
# #         loop=loop,
# #         bootstrap_servers='kafka',
# #         enable_auto_commit=False,
# #     )

# #     await consumer.start()
# #     try:
# #         # Consume messages
# #         async for msg in consumer:
# #             print("consumed: ", msg.topic, msg.partition, msg.offset, msg.key, msg.value, msg.timestamp)
# #             await write_binance_ticker_to_db_async(json.loads(msg.value))
# #     except LeaderNotAvailableError:
# #         time.sleep(1)
# #         async for msg in consumer:
# #             print("consumed: ", msg.topic, msg.partition, msg.offset, msg.key, msg.value, msg.timestamp)
# #             await write_binance_ticker_to_db_async(json.loads(msg.value))
# #     finally:
# #         # Will leave consumer group; perform autocommit if enabled.
# #         await consumer.stop()

async def consume(consumer, topic_name):
    async for msg in consumer:
        return msg.value.decode()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    topic_name = "binanceticker"
    msg = {"Message: ": "connected"}
    await websocket.send_json(msg)
    
    loop = asyncio.get_event_loop()
    consumer = AIOKafkaConsumer(
        KAFKA_CREATE_TOPICS,
        loop=loop,
        bootstrap_servers='kafka',
        enable_auto_commit=False,
    )

    await consumer.start()
    counter = 0
    print('Kafka Consumer started .............')
    try:
        # Consume messages
        async for msg in consumer:
            await websocket.send_json(msg.value.decode("utf-8"))
            print("websocket.send_text(msg.value): ","SENT!!!!!")
    except LeaderNotAvailableError:
        time.sleep(1)
        async for msg in consumer:
            await websocket.send_json(msg.value.decode("utf-8"))
            print("websocket.send_text(msg.value): ","SENT!!!!!")
    finally:
        # Will leave consumer group; perform autocommit if enabled.
        await consumer.stop()
