import typing, time, abc
import aiohttp
import asyncio
import json
import os
from typing import Optional
import json, os, asyncio, websockets
from aiokafka import AIOKafkaProducer
from aiokafka.errors import LeaderNotAvailableError
from binance.client import Client
from aiohttp import ClientSession

# CONSTANTS
CURRENCY = 'usdt'
SYMBOLS = [
  "btc"  , "xrp"  , "doge" , "xlm"  , "trx"  , 
  "eos"  , "ltc"  , "iota", "xmr"  , "link" , 
  "etn"  , "rdd"  , "strax", "npxs" , "glm"  ,
  "aave" , "sol"  , "atom" , "cro"  , "ht"   ,
  "mkr"  , "snx"  , "algo" , "ksm"  , "comp" ,
  "vgx"  , "ftm"  , "zec"  , "rune" , "cel"  ,
  "rev"  , "icx"  , "hbar" , "chsb" , "iost" ,
  "zks"  , "lrc"  , "omg"  , "pax"  , "husd" ,
  "vet"  , "sc"   , "btt"  , "dash" , "xtz"  ,
  "bch"  , "bnb"  , "ada"  , "usdt" , "dcn"  ,
  "tfuel", "xvg"  , "rvn"  , "bat"  , "dot"  ,
  "theta", "luna" , "neo"  , "ftt"  , "dai"  ,
  "egld" , "fil"  , "leo"  , "sushi", "dcr"  ,
  "ren"  , "nexo" , "zrx"  , "okb"  , "waves",
  "dgb"  , "ont"  , "bnt"  , "nano" , "matic",
  "xwc"  , "zen"  , "btmx" , "qtum" , "hnt"  ,
  "KNDC" , "delta", "pib"  , "opt"  , "acdc", 
  "eth",
]

# ENVIRONMENTAL VARIABLES
SCHEMA = os.environ.get("SCHEMA")
BINANCE_API_BASE_URL = os.environ.get("BINANCE_API_BASE_URL")
KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")

# INTERFACES / ABSTRACTIONS
class ICryptoInstrument(abc.ABC):
    @abc.abstractmethod
    async def _coro(self, symbol: str, currency: str) -> None:
        pass

    @abc.abstractmethod
    async def gather_instrument_coros(self) -> None:
        pass

    @abc.abstractmethod
    async def _get_kline_async(self, symbol: str, currency: str) -> None:
        pass


class ICryptoApiProducer(abc.ABC):       
    @abc.abstractmethod 
    async def produce(self, data: dict) -> None:
        pass

# CONCRETE IMPLEMENTATIONS
class CryptoInstrument(ICryptoInstrument):
    """
    Class that receives an injected producer, creates a coroutine per crypto symbol
    by openining a websocket connection to an exchange endpoint 
    and uses the injected producer to push stream data per crypto (per coroutine) to the Kafka topic.
    """
    def __init__(self, producer: ICryptoApiProducer, endpoint: str, interval: str, exchange: str) -> None:
        self.producer = producer
        self.endpoint = endpoint
        self.interval = interval
        self.exchange = exchange

    async def gather_instrument_coros(self) -> None:
        coros = [self._coro(symbol, CURRENCY) for symbol in SYMBOLS]
        await asyncio.gather(*coros)

    async def _coro(self, symbol: str, currency: str) -> None:
        await self._get_kline_async(symbol, currency)

    async def _get_kline_async(self, symbol: str, interval: str, start_ts: int, end_ts: int, limit: int, currency: str, session) -> None:
        """
        """
        url = BINANCE_API_BASE_URL
        payload = {
            'symbol': symbol,
            'interval': interval,
            # 'startTime': start_ts,
            # 'endTime': end_ts,
            'limit': limit,
        }
        try:
            response = await session.request(method='GET', url=url, params=payload)
            response.raise_for_status()
            print(f"Response status ({url}): {response.status}")
        except aiohttp.ClientConnectorError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except Exception as err:
            print(f"An error ocurred: {err}")
        response_json = await response.json()
        return response_json
    
    async def run_program(self, symbol, interval, start_ts, end_ts, limit, currency, session):
        """Wrapper for running program in an asynchronous manner"""
        try:
            response = await self._get_kline_async(symbol, currency, session)
            data_json = json.dumps(response)
            print(f"Response: {data_json}")
            msg = {**data_json, "exchange": self.exchange}
            await self.producer.produce(msg)
        except Exception as err:
            print(f"Exception occured: {err}")
            pass

class CryptoApiProducer(ICryptoApiProducer):
    """
    Class that creates a Kafka producer and pushes crypto related api data to a Kafka topic 
    """
    async def produce(self, message: dict) -> None:
        producer = AIOKafkaProducer(bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME)

        # get cluster layout and initial topic/partition leadership information
        await producer.start()
        try:
            # produce message
            value_json = json.dumps(message).encode('utf-8')
            # print("PRODUCING TICKER !!!!!!!!!!!!!!!!!: ", value_json)
            await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
        # except LeaderNotAvailableError:
        #     time.sleep(1)
        #     value_json = json.dumps(message).encode('utf-8')
        #     await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
        finally:
            # wait for all pending messages to be delivered or expire.
            await producer.stop()

# MAIN ENTRYPOINT
if __name__ == '__main__':
    exchange = "binance"
    endpoint = f"{BINANCE_API_BASE_URL}/klines"
    interval = "1m"

    producer = CryptoApiProducer()
    instrument1 = CryptoInstrument(producer, endpoint, interval, exchange)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(instrument1.gather_instrument_coros())

    async with ClientSession() as session:
        await asyncio.gather(*[run_program(symbol, CURRENCY, session) for symbol in symbols])