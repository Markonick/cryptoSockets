import typing, time, abc, aiohttp, asyncio, json, os
from typing import Optional
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
BINANCE_API_BASE_URL = os.environ.get("BINANCE_API_BASE_URL")
KAFKA_ADVERTISED_HOST_NAME = os.environ.get("KAFKA_ADVERTISED_HOST_NAME")
KAFKA_TOPIC = os.environ.get("KAFKA_TOPIC")


# INTERFACES / ABSTRACTIONS
class ICryptoInstrument(abc.ABC):
    @abc.abstractmethod
    async def _coro(self, params: dict, symbol: str, session) -> None:
        pass

    @abc.abstractmethod
    async def gather_instrument_coros(self) -> None:
        pass

    @abc.abstractmethod
    async def _get_kline_async(self, params: dict, session) -> None:
        pass


class ICryptoApiProducer(abc.ABC):       
    @abc.abstractmethod 
    async def produce(self, data: dict) -> None:
        pass


class KlinesResponseMessage(object):   
    @classmethod
    def get_klines(cls, payload: dict, exchange: str, symbol: str) -> str:
        klines = [cls._get_single_kline_to_dict(kline) for kline in payload]
        reponse = {
            "exchange": exchange,
            "symbol": symbol,
            "klines": klines,
        }

        return reponse
     
    def _get_single_kline_to_dict(kline: list) -> dict:
        kline_keys = [
            "open_time",
            "open",
            "high",
            "low",
            "close",
            "volume",
            "close_time",
            "quote_asset_volume",
            "number_of_trades",
            "taker_buy_base_asset_volume",
            "taker_buy_quote_asset_volume",
            "ignore"
        ]

        kline_dict = dict(zip(kline_keys, kline))

        return kline_dict


# CONCRETE IMPLEMENTATIONS
class CryptoInstrument(ICryptoInstrument):
    """
    Class that receives an injected producer, creates a coroutine per crypto symbol
    by calling the API endpoint and uses the injected producer to push api data per 
    crypto (per coroutine) to the Kafka topic.
    """
    def __init__(self, producer: ICryptoApiProducer, endpoint: str, interval: str, exchange: str, start_ts: int=None, end_ts: int=None, limit: int=500) -> None:
        self.producer = producer
        self.endpoint = endpoint
        self.interval = interval
        self.exchange = exchange
        self.start_ts = start_ts
        self.end_ts = end_ts
        self.limit = limit

    async def gather_instrument_coros(self) -> None:
        async with aiohttp.ClientSession() as session:
            coros = [
                self._coro(self._createQueryParams(symbol, self.interval, self.limit, self.start_ts, self.end_ts), symbol, session) 
                for symbol in SYMBOLS
            ]

            await asyncio.gather(*coros)

    async def _coro(self, params: dict, symbol: str, session) -> None:
        await self._push_to_kafka(params, symbol, session )

    def _createQueryParams(self, symbol: str, interval: str, limit: int, start_ts: int=None, end_ts: int=None) -> dict:
        """Prepare query params for klines api"""
        params = {
            'symbol': f"{symbol}{CURRENCY}".upper(),
            'interval': interval,
            'startTime': start_ts,
            'endTime': end_ts,
            'limit': limit,
        }

        return {k: v for k, v in params.items() if v != None}

    async def _get_kline_async(self, params: dict, session) -> dict:
        """Get async kline api. Returns array of klines for time window"""
        async with session.get(self.endpoint, params=params) as resp:
            try:
                if resp.status == 200:
                    return await resp.json()
            except Exception as e:
                print(e)
                return None
    
    async def _push_to_kafka(self, params: dict, symbol: str, session) -> None:
        """Wrapper for running program in an asynchronous manner, pushes api reposnse to kafka"""
        try:
            while True:
                response = await self._get_kline_async(params, session)
                if response != None:
                    msg = KlinesResponseMessage.get_klines(response, self.exchange, symbol)
                    print(msg)
                    await self.producer.produce(msg)
                    time.sleep(30)
        except Exception as err:
            print(f"Exception occured: {err}")
            pass


class CryptoApiProducer(ICryptoApiProducer):
    """Class that creates a Kafka producer and pushes crypto related api data to a Kafka topic"""
    async def produce(self, message: dict) -> None:
        producer = AIOKafkaProducer(bootstrap_servers=KAFKA_ADVERTISED_HOST_NAME)

        # get cluster layout and initial topic/partition leadership information
        await producer.start()
        try:
            # produce message
            value_json = json.dumps(message).encode('utf-8')
            print("PRODUCING TICKER !!!!!!!!!!!!!!!!!: ", value_json)
            await producer.send_and_wait(KAFKA_TOPIC, value_json)
        finally:
            # wait for all pending messages to be delivered or expire.
            await producer.stop()


# MAIN ENTRYPOINT
if __name__ == '__main__':
    exchange = "binance"
    endpoint = f"{BINANCE_API_BASE_URL}/klines"
    interval = "1m"
    start_ts = None
    end_ts = None
    limit = 1000
    producer = CryptoApiProducer()
    instrument = CryptoInstrument(producer, endpoint, interval, exchange, start_ts, end_ts, limit)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(instrument.gather_instrument_coros())
