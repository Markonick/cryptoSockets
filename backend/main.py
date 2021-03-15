import typing, time
from typing import Optional
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json, os, asyncio, websockets
from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
import asyncpg

# Example model:
# {
#   "e": "24hrTicker",  // Event type
#   "E": 123456789,     // Event time
#   "s": "BNBBTC",      // Symbol
#   "p": "0.0015",      // Price change
#   "P": "250.00",      // Price change percent
#   "w": "0.0018",      // Weighted average price
#   "x": "0.0009",      // First trade(F)-1 price (first trade before the 24hr rolling window)
#   "c": "0.0025",      // Last price
#   "Q": "10",          // Last quantity
#   "b": "0.0024",      // Best bid price
#   "B": "10",          // Best bid quantity
#   "a": "0.0026",      // Best ask price
#   "A": "100",         // Best ask quantity
#   "o": "0.0010",      // Open price
#   "h": "0.0025",      // High price
#   "l": "0.0010",      // Low price
#   "v": "10000",       // Total traded base asset volume
#   "q": "18",          // Total traded quote asset volume
#   "O": 0,             // Statistics open time
#   "C": 86400000,      // Statistics close time
#   "F": 0,             // First trade ID
#   "L": 18150,         // Last trade Id
#   "n": 18151          // Total number of trades
# }

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
SCHEMA = "cryptos"

def get_insert_to_tick_query(data):
    return f"""
        INSERT INTO tick (
            event_time,
            symbol,
            price_change,
            price_change_percent,
            last_price,
            open_price,
            high_price,
            low_price
        ) 
        VALUES (
            {data["E"]},
            {data["s"]},
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
            event_time INTEGER,
            symbol TEXT,
            price_change FLOAT,
            price_change_percent FLOAT,
            last_price FLOAT,
            open_price FLOAT,
            high_price FLOAT,
            low_price FLOAT
        )
    """)

async def cryptodb_insert(data):
    async with await pool.acquire() as conn:
        # Open a transaction.
        async with conn.transaction():
            result = await conn.fetch(get_insert_to_tick_query(data))
            print(f"cryptodb_insert result: {result}")

        # return result

async def get_binance_ticker_async(symbol: str) -> None:
    
    conn = await asyncpg.connect('postgres://devUser:devUser1@cryptodb:5432/cryptos')
    subscribe = json.dumps({"method": "SUBSCRIBE", "params": [f"{symbol}@ticker"], "id": 1})
    binance_address = "wss://stream.binance.com:9443/ws"
    async with websockets.connect(binance_address) as websocket:
        await websocket.send(subscribe)    
        while True:
            data = await websocket.recv()
            data = json.loads(data)
            print('\n', data)
            time.sleep(10)
            await conn.fetch(get_insert_to_tick_query(data))
            # await cryptodb_insert(data)
            # result = await cryptodb_inserts(data)
            # print('\n', result)
    await conn.close()
async def multiple_tasks():
#   input_coroutines = [ setup_database()]
  input_coroutines = [ create_pool()(), get_binance_ticker_async('btcusdt')]
  res = await asyncio.gather(*input_coroutines, return_exceptions=True)
  return res

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # loop.run_until_complete(create_pool())
    # loop.run_until_complete(setup_database())
    loop.run_until_complete(get_binance_ticker_async('btcusdt'))