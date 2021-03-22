import typing, time
from typing import Optional
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json, os, asyncio, websockets
from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
import asyncpg
from aiokafka import AIOKafkaConsumer
from aiokafka.errors import LeaderNotAvailableError

app = FastAPI()
SCHEMA = os.environ.get("SCHEMA")
KAFKA_HOST = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")
print(SCHEMA)
print(KAFKA_HOST)
print(KAFKA_CREATE_TOPICS)


loop = asyncio.get_event_loop()

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
    print("SCHEMA: ", SCHEMA)
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
                

async def write_binance_ticker_to_db_async(data) -> None:
    conn = await asyncpg.connect('postgres://devUser:devUser1@cryptodb:5432/cryptos')
            
    print('***************CONSUMING***************')
    print('***************CONSUMING***************')
    print('***************CONSUMING***************')
    print('***************CONSUMING***************')
    print('***************CONSUMING***************')
    print('***************CONSUMING***************')

    await conn.fetch(get_insert_to_tick_query(data))
    await conn.close()

async def consume() -> None:
    consumer = AIOKafkaConsumer(
        KAFKA_CREATE_TOPICS,
        loop=loop,
        bootstrap_servers='kafka',
        enable_auto_commit=False,
    )

    await consumer.start()
    try:
        # Consume messages
        async for msg in consumer:
            print("consumed: ", msg.topic, msg.partition, msg.offset, msg.key, msg.value, msg.timestamp)
            await write_binance_ticker_to_db_async(json.loads(msg.value))
    except LeaderNotAvailableError:
        time.sleep(1)
        async for msg in consumer:
            print("consumed: ", msg.topic, msg.partition, msg.offset, msg.key, msg.value, msg.timestamp)
            await write_binance_ticker_to_db_async(json.loads(msg.value))
    finally:
        # Will leave consumer group; perform autocommit if enabled.
        await consumer.stop()
     

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # loop.run_until_complete(create_pool())
    loop.run_until_complete(setup_database())   
    loop.run_until_complete(consume())   