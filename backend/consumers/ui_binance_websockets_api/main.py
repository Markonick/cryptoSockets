# import typing, time
# from typing import Optional, Any
# from fastapi import FastAPI, WebSocket, Query, status
# from fastapi.responses import HTMLResponse
# from pydantic import BaseModel
# import json, os, asyncio
# from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
# import asyncpg
# from aiokafka import AIOKafkaConsumer
# from aiokafka.errors import LeaderNotAvailableError
# from starlette.endpoints import WebSocketEndpoint
# from starlette.middleware.cors import CORSMiddleware

# app = FastAPI()
# app.add_middleware(CORSMiddleware, allow_origins=["*"])

# KAFKA_HOST = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
# KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")
# print(KAFKA_HOST)
# print(KAFKA_CREATE_TOPICS)


# # loop = asyncio.get_event_loop()
            

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

# async def consume(consumer, topic_name):
#     async for msg in consumer:
#         return msg.value.decode()

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     print('!!!!!!!!!!!!!!!!!!!"23423ferg3w5yhw4r6je56jedt7j5!!!!!!!!!!!!!!!!!!!!!!')
#     print('!!!!!!!!!!!!!!!!!!!"23423ferg3w5yhw4r6je56jedt7j5!!!!!!!!!!!!!!!!!!!!!!')
#     print('!!!!!!!!!!!!!!!!!!!"23423ferg3w5yhw4r6je56jedt7j5!!!!!!!!!!!!!!!!!!!!!!')
#     print('!!!!!!!!!!!!!!!!!!!"23423ferg3w5yhw4r6je56jedt7j5!!!!!!!!!!!!!!!!!!!!!!')
#     print('!!!!!!!!!!!!!!!!!!!"23423ferg3w5yhw4r6je56jedt7j5!!!!!!!!!!!!!!!!!!!!!!')
#     print('!!!!!!!!!!!!!!!!!!!"23423ferg3w5yhw4r6je56jedt7j5!!!!!!!!!!!!!!!!!!!!!!')
#     try:
#         await websocket.accept()
#     except Exception as e:
#         print('"""""""""""""""""""""""""""""')
#         print('"""""""""""""""""""""""""""""')
#         print('"""""""""""""""""""""""""""""')
#         print('"""""""""""""""""""""""""""""')
#         print('"""""""""""""""""""""""""""""')
#         print('"""""""""""""""""""""""""""""')
#         print('"""""""""""""""""""""""""""""')
#         print(e)
#     while True:
#         data = await websocket.receive_text()
#         await websocket.send_text(f"Message text was: YO YO YO YO!!!")

# # @app.websocket_route("/consumer/binanceticker")
# @app.websocket_route("/consumer")
# class UiBinanceTickerConsumer(WebSocketEndpoint):
#     """
#     Consume mesages from Kafka binanceticker topic
#     ws://127.0.0.1:8004/consumer/binanceticker
#     ws://0.0.0.0:8004/ws
#     """
#     async def on_connect(self, websocket: WebSocket) -> None:
#         topic_name = "binanceticker"
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#         await websocket.accept()
#         msg = {"Message: ": "connected"}
#         print(msg)
#         print(msg)
#         print(msg)
#         print(msg)
#         print(msg)
#         print(msg)
#         print(msg)
#         print(msg)
#         await websocket.send_json(msg)

#         loop = asyncio.get_event_loop()
#         self.consumer = AIOKafkaConsumer(topic_name,
#             loop=loop,
#             bootstrap_servers='kafka',
#         )

#         print('Consumer connected .............')
#         await self.consumer.start()
#         print('Consumer started .............')

#         self.consumer_task = asyncio.create_task(self.send_consumer_message(websocket=websocket, topic_name=topic_name))

#     async def on_disconnect(self, websocket: WebSocket) -> None:
#         self.consumer_task.cancel()
#         await self.consumer.stop()

#     async def on_receive(self, websocket: WebSocket, data: Any) -> None:
#         await websocket.send_json({"Message: ": data})

#     async def send_consumer_message(self, websocket: WebSocket, topic_name: str) -> None:
#         self.counter = 0
#         while True:
#             data = await consume(self.consumer, topic_name)
#             response = {topic: topic_name, **json.loads(data)}
#             await websocket.send_text(f"{response.json()}")
#             self.counter = self.counter + 1

from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print('!!!!!!!!!!!!!!!!fergfeargwe4!!!!!!!!!!!!!!!!')
    print('!!!!!!!!!!!!!!!!fergfeargwe4!!!!!!!!!!!!!!!!')
    print('!!!!!!!!!!!!!!!!fergfeargwe4!!!!!!!!!!!!!!!!')
    print('!!!!!!!!!!!!!!!!fergfeargwe4!!!!!!!!!!!!!!!!')
    print('!!!!!!!!!!!!!!!!fergfeargwe4!!!!!!!!!!!!!!!!')
    print('!!!!!!!!!!!!!!!!fergfeargwe4!!!!!!!!!!!!!!!!')
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")