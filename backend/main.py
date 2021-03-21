import typing, time
from typing import Optional
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json, os, asyncio, websockets
from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
import asyncpg
from aiokafka import AIOKafkaProducer

# class SymbolTicker(BaseModel):
#     event_type: str
#     event_time: int
#     symbol: str
#     price_change: float
#     price_change_percent: float
#     weighted_average_price: float
#     first_trade_f_1_price: float
#     last_price: float
#     last_quantity: int
#     best_bid_price: float
#     best_bid_quantity: int
#     best_ask_price: float
#     best_ask_quantity: int
#     open_price: float
#     high_price: float
#     low_price: float
#     total_traded_base_asset_volume: int
#     total_traded_quote_asset_volume: int
#     statistics_open_time: int
#     statistics_close_time: int
#     first_trade_id: int
#     last_trade_id: int
#     total_number_of_trades


app = FastAPI()
SCHEMA = os.environ.get("SCHEMA")
KAFKA_HOST = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")
print(SCHEMA)
print(KAFKA_HOST)
print(KAFKA_CREATE_TOPICS)

def get_insert_to_tick_query(data):
    return f"""
        INSERT INTO {SCHEMA}.tick (
            symbol,
            event_time,
            price_change,
            price_change_percent,
            last_price,
            open_price,
            high_price,
            low_price
        ) 
        VALUES (
            '{data["s"]}',
            {data["E"]},
            {data["p"]},
            {data["P"]},
            {data["c"]},
            {data["o"]},
            {data["h"]},
            {data["l"]}
        )
    """

async def create_pool():
    global pool

    pool = await asyncpg.create_pool(
        user=os.getenv('POSTGRES_USER', 'devUser'),
        password=os.getenv('POSTGRES_PASSWORD', 'devUser1'),
        database=os.getenv('POSTGRES_DB', 'cryptos'),
        host='cryptodb',
        port=5432
    )

async def setup_database():
    conn = await asyncpg.connect('postgres://devUser:devUser1@cryptodb:5432/cryptos')
    # Execute a statement to create a new table.
    await conn.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}")
    await conn.execute(f"""
        CREATE TABLE IF NOT EXISTS {SCHEMA}.tick(
            id serial PRIMARY KEY,
            symbol TEXT,
            event_time BIGINT,
            price_change FLOAT,
            price_change_percent FLOAT,
            last_price FLOAT,
            open_price FLOAT,
            high_price FLOAT,
            low_price FLOAT
        )
    """)

async def get_binance_ticker_async(symbol: str) -> None:
    conn = await asyncpg.connect('postgres://devUser:devUser1@cryptodb:5432/cryptos')
    subscribe = json.dumps({"method": "SUBSCRIBE", "params": [f"{symbol}@ticker"], "id": 1})
    print(subscribe)
    binance_address = "wss://stream.binance.com:9443/ws"
    async with websockets.connect(binance_address) as websocket:
        await websocket.send(subscribe)    
        while True:
            data = await websocket.recv()
            data = json.loads(data)
            print('\n', data)
            if 'result' not in data:
                print(data)
                # await cryptodb_insert(data)
                await send_one(data)
                # await conn.fetch(get_insert_to_tick_query(data))
                
    await conn.close()


async def send_one(data):
    loop = asyncio.get_event_loop()
    producer = AIOKafkaProducer(loop=loop, bootstrap_servers='kafka')
    # get cluster layout and initial topic/partition leadership information
    await producer.start()
    try:
        # produce message
        value_json = json.dumps(data).encode('utf-8')
        await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
    finally:
        # wait for all pending messages to be delivered or expire.
        await producer.stop()

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # loop.run_until_complete(create_pool())
    loop.run_until_complete(setup_database())
    loop.run_until_complete(get_binance_ticker_async('btcusdt'))