import typing, time, abc
from typing import Optional
from fastapi import FastAPI, WebSocket, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import json, os, asyncio, websockets
from starlette.responses import HTMLResponse, UJSONResponse, PlainTextResponse
import asyncpg
from aiokafka import AIOKafkaProducer
from aiokafka.errors import LeaderNotAvailableError

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
  "KNDC" , "delta", "pib"  , "opt"  , "acdc", "eth",
]
CURRENCY = 'usdt'

app = FastAPI()
SCHEMA = os.environ.get("SCHEMA")
KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_CREATE_TOPICS = os.environ.get("KAFKA_CREATE_TOPICS")


class ICryptoInstrument(abc.ABC):
    @abc.abstractmethod
    async def coro(self, symbol: str, currency: str) -> None:
        pass

    @abc.abstractmethod
    async def gather_instrument_coros(self) -> None:
        pass

    @abc.abstractmethod
    async def websocket_instrument_async(self, symbol: str, currency: str) -> None:
        pass


class ICryptoStreamProducer(abc.ABC):       
    @abc.abstractmethod 
    async def produce(self, data: dict) -> None:
        pass


class CryptoInstrument(ICryptoInstrument):
    def __init__(self, producer: ICryptoStreamProducer, endpoint: str, exchange: str, stream: str) -> None:
        self.producer = producer
        self.stream = stream
        self.endpoint = endpoint
        self.exchange = exchange

    async def coro(self, symbol: str, currency: str) -> None:
        await self.websocket_instrument_async(symbol, currency)

    async def gather_instrument_coros(self) -> None:
        coros = [self.coro(symbol, CURRENCY) for symbol in SYMBOLS]
        await asyncio.gather(*coros)

    async def websocket_instrument_async(self, symbol: str, currency: str) -> None:
        subscribe = json.dumps({"method": "SUBSCRIBE", "params": [f"{symbol}{currency}@{self.stream}"], "id": 1})
        async with websockets.connect(self.endpoint) as websocket:
            await websocket.send(subscribe)    
            while True:
                data = await websocket.recv()
                data = json.loads(data)
                if 'result' not in data:
                    await self.producer.produce(data, self.exchange)


class CryptoStreamProducer(ICryptoStreamProducer):
    async def produce(self, data: dict, exchange: str) -> None:
        producer = AIOKafkaProducer(bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME)

        # get cluster layout and initial topic/partition leadership information
        await producer.start()
        try:
            # produce message
            value_json = json.dumps({**data, "exchange": exchange}).encode('utf-8')
            print("PRODUCING TICKERS !!!!!!!!!!!!!!!!!")
            await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
        except LeaderNotAvailableError:
            time.sleep(1)
            value_json = json.dumps({**data, "exchange": exchange}).encode('utf-8')
            await producer.send_and_wait(KAFKA_CREATE_TOPICS, value_json)
        finally:
            # wait for all pending messages to be delivered or expire.
            await producer.stop()


if __name__ == '__main__':
    exchange = "binance"
    endpoint = "wss://stream.binance.com:9443/ws"
    stream = 'ticker'
    producer = CryptoStreamProducer()
    instrument = CryptoInstrument(producer, endpoint, exchange, stream)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(instrument.gather_instrument_coros())