import typing, time, abc
from typing import Optional
import json, os, asyncio, websockets
from aiokafka import AIOKafkaProducer
from aiokafka.errors import LeaderNotAvailableError

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
KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_TOPIC = os.environ.get("KAFKA_TOPIC")


# INTERFACES / ABSTRACTIONS
class ICryptoInstrument(abc.ABC):
    @abc.abstractmethod
    async def _coro(self, symbol: str, currency: str) -> None:
        pass

    @abc.abstractmethod
    async def gather_instrument_coros(self) -> None:
        pass

    @abc.abstractmethod
    async def _websocket_instrument_async(self, symbol: str, currency: str) -> None:
        pass


class ICryptoStreamProducer(abc.ABC):       
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
    def __init__(self, producer: ICryptoStreamProducer, endpoint: str, exchange: str, stream: str) -> None:
        self.producer = producer
        self.stream = stream
        self.endpoint = endpoint
        self.exchange = exchange

    async def gather_instrument_coros(self) -> None:
        coros = [self._coro(symbol, CURRENCY) for symbol in SYMBOLS]
        await asyncio.gather(*coros)

    async def _coro(self, symbol: str, currency: str) -> None:
        await self._websocket_instrument_async(symbol, currency)

    async def _websocket_instrument_async(self, symbol: str, currency: str) -> None:
        subscribe = json.dumps({"method": "SUBSCRIBE", "params": [f"{symbol}{currency}@{self.stream}"], "id": 1})
        async with websockets.connect(self.endpoint) as websocket:
            await websocket.send(subscribe)   

            while True:
                data = await websocket.recv()
                data_json = json.loads(data)

                if 'result' not in data_json:
                    msg = {**data_json, "exchange": self.exchange}
                    await self.producer.produce(msg)


class CryptoStreamProducer(ICryptoStreamProducer):
    """
    Class that creates a Kafka producer and pushes crypto related stream data to a Kafka topic 
    """
    async def produce(self, message: dict) -> None:
        producer = AIOKafkaProducer(bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME)

        # get cluster layout and initial topic/partition leadership information
        await producer.start()
        try:
            # produce message
            value_json = json.dumps(message).encode('utf-8')
            # print("PRODUCING TICKER !!!!!!!!!!!!!!!!!: ", value_json)
            await producer.send_and_wait(KAFKA_TOPIC, value_json)
        # except LeaderNotAvailableError:
        #     time.sleep(1)
        #     value_json = json.dumps(message).encode('utf-8')
        #     await producer.send_and_wait(KAFKA_TOPIC, value_json)
        finally:
            # wait for all pending messages to be delivered or expire.
            await producer.stop()

# MAIN ENTRYPOINT
if __name__ == '__main__':
    exchange = "binance"
    endpoint = "wss://stream.binance.com:9443/ws"

    stream1 = 'ticker'
    interval = "1m"
    stream2 = f"kline_{interval}"

    producer = CryptoStreamProducer()
    instrument1 = CryptoInstrument(producer, endpoint, exchange, stream1)
    instrument2 = CryptoInstrument(producer, endpoint, exchange, stream2)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(instrument1.gather_instrument_coros())
    loop.run_until_complete(instrument2.gather_instrument_coros())