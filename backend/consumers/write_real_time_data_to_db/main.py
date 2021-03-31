import typing, time
from typing import Optional
import json, os, asyncio
import asyncpg
from aiokafka import AIOKafkaConsumer
from aiokafka.errors import LeaderNotAvailableError

SCHEMA = os.environ.get("SCHEMA")
KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")


loop = asyncio.get_event_loop()

def insert_tick_query(data):
    return f"""
        INSERT INTO {SCHEMA}.tick (
            symbol,
            exchange,
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
            '{data["exchange"]}',
            {data["E"]},
            {data["p"]},
            {data["P"]},
            {data["c"]},
            {data["o"]},
            {data["h"]},
            {data["l"]}
        )
    """

def insert_kline_query(data):
    return f"""
        INSERT INTO {SCHEMA}.kline (
            symbol,
            exchange,
            event_time,
            open_price,
            close_price,
            high_price,
            low_price,
            interval,
            start_time,
            close_time,
            number_of_trades
        ) 
        VALUES (
            '{data["s"]}',
            '{data["exchange"]}',
            {data["E"]},
            {data["o"]},
            {data["c"]},
            {data["h"]},
            {data["l"]},
            {data["i"]},
            {data["t"]},
            {data["T"]},
            {data["n"]}
        )
    """

async def write_msg_to_db_async(data) -> None:
    conn = await asyncpg.connect('postgres://devUser:devUser1@cryptodb:5432/cryptos')  
    if data["e"] == "24hrTicker":
        await conn.fetch(insert_tick_query(data))

    if data["e"] == "kline":
        await conn.fetch(insert_kline_query(data))

    await conn.close()

async def consume() -> None:
    consumer = AIOKafkaConsumer(
        KAFKA_CREATE_TOPICS,
        loop=loop,
        bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME,
        enable_auto_commit=False,
    )

    await consumer.start()
    try:
        # Consume messages
        async for msg in consumer:
            # print("consumed: ", msg.topic, msg.partition, msg.offset, msg.key, msg.value, msg.timestamp)
            await write_msg_to_db_async(json.loads(msg.value))
    except LeaderNotAvailableError:
        time.sleep(1)
        async for msg in consumer:
            # print("consumed: ", msg.topic, msg.partition, msg.offset, msg.key, msg.value, msg.timestamp)
            await write_msg_to_db_async(json.loads(msg.value))
    finally:
        # Will leave consumer group; perform autocommit if enabled.
        await consumer.stop()
     

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    # loop.run_until_complete(create_pool()) 
    loop.run_until_complete(consume())   