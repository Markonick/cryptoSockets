import React, { useState, useEffect } from 'react';

const Tick = (symbol, currency) => {
    const [tick, setTick] = useState({});
    const [price, setPrice] = useState(0);
    const [change, setChange] = useState(0);
    
    const symbolTicker = (symbol, currency) => { 
        const subscribe = {
            "method": "SUBSCRIBE",
            "params": [
                `${symbol.toLowerCase()}${currency}@ticker`,
            ],
            "id": 1
        }

        // const ws = new WebSocket('wss://stream.binance.com:9443/ws');
        const ws = new WebSocket('ws://127.0.0.1:8000/ws');
        // const ws = new WebSocket('ws://127.0.0.1:8000/consumer');
        ws.onopen = () => {
            ws.send(JSON.stringify(subscribe));
        };
        ws.onmessage = (event) => {
            let incomingTick = JSON.parse(event.data);
            console.log(incomingTick)
            setTick(incomingTick)
        };
        ws.onclose = () => {
            ws.close();
        };

        return () => {
            ws.close();
        };
    }
    
    // Effect to initialise ticker on render (eg first render or refresh)
    useEffect(() => {
        symbolTicker(symbol, currency)
    }, [])
    
    useEffect(() => {   
        let oldPrice = price;
        let newPrice = Number(tick.c)
        let calculatedChange = calcChange(oldPrice, newPrice)

        setChange(calculatedChange.toFixed(7))
        setPrice(newPrice)
    }, [tick])

    const calcChange = (prevPrice, newPrice) => {
        let change = newPrice - prevPrice

        return change
    }

    return { price: price, change: change,  }
};

export default Tick;