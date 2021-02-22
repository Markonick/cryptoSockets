import React, { useState, useEffect } from 'react';

const OrderBook = () => {
  const [previousTick, setPreviousTick] = useState({});
  const [tick, setTick] = useState({});
  const [diff, setDiff] = useState();
  const currencyPair = 'btcusd';

  const currencyArray = currencyPair.toUpperCase().match(/.{1,3}/g);

  useEffect(() =>  {
    const subscribe ={
        "method": "SUBSCRIBE",
        "params": [
          "btcusdt@aggTrade",
        ],
        "id": 1
      }
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      // setPreviousTick(tick);
      const incomingTick = JSON.parse(event.data);
      let calculatedDiff =  Number(incomingTick.p) - Number(tick.p)
      setTick(incomingTick)
      setDiff(calculatedDiff)
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);


  useEffect(() =>  {
      setPreviousTick(tick);
  }, [tick]);
  

  let color = ""
  // let diff = previousTick.p - tick.p;
  
  
  console.log("previousTick: ", previousTick.p) 
  console.log("tick: ", tick.p)
  console.log("diff: ", diff)
  color = diff > 0 ? "green": "red"
  
  return (
    <div className="order-container">
      <table>
        Symbol: {tick.s} <br/>
        {() => setPreviousTick(tick)}
        <span style={{color: color}}>Previous Price: {previousTick.p} </span><br/>
        <span style={{color: color}}>Diff: {diff} </span><br/>
        <span style={{color: color}}>Price: {tick.p} </span><br/>
      </table>
    </div>
  );
};

export default OrderBook;