import { useEffect, useState } from 'react'
import ApiCore from './utilities/Core'

const apiKline = new ApiCore({
  getAll: true,
  url: 'klines',
});

function KlineData(params) {
  const [data, setData] = useState()
  //wss://dstream.binance.com
  //"btcusd_200626@kline_1m"
  // useEffect(() => {
  //   getDataPoints()
  //   setInterval(async () => { 
  //     getDataPoints()
  //   }, 10000);
  // }, [])

  useEffect(() => {
    const subscribe = {
        "method": "SUBSCRIBE",
        "params": [
            // `${symbol.toLowerCase()}${currency}@kline_1m`,
            `btcusdt@kline_1m`,
        ],
        "id": 1
    }
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    ws.onopen = () => {
        console.log(JSON.stringify(subscribe))
        ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
        let incomingTick = JSON.parse(event.data);
        console.log(incomingTick)
        // if(incomingTick.result === undefined) {
          setData(incomingTick)
          console.log(incomingTick)
        // }
    };
    ws.onclose = () => {
        ws.close();
    };

    return () => {
        ws.close();
    };
  }, []);

  function getDataPoints() {
    apiKline.getAll(params).then((res) => {
      setData(res)
    })
  }

  function parseData(data) {
    return data.map((item) => {
      // Parse data information
      return item
    })
  }

  return data
};

export default KlineData;