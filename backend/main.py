import typing
from typing import Optional
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

app = FastAPI()

async def get_binance_ticker_async(symbol: str) -> None:

    subscribe = json.dumps({"method": "SUBSCRIBE", "params": [f"{symbol}@ticker"], "id": 1})
    binance_address = "wss://stream.binance.com:9443/ws"
    async with websockets.connect(binance_address) as websocket:
        await websocket.send(subscribe)    
        while True:
            data = await websocket.recv()
            data = json.loads(data)
            print('\n', data)
            
            yield data
# @app.get("/")
# async def get():
#     Websocket_client()
#     return 'yo'

# @app.get("/items/{item_id}", status_code=200)
# async def read_item(item_id: str, q: Optional[str] = Query(None, max_length=50)):
#     results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
#     if q:
#         results.update({"q": q})
#     return results
    
# @app.post("/items/")
# async def create_item(item: Item):
#     return item
    
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(get_binance_ticker_async('btcusdt'))