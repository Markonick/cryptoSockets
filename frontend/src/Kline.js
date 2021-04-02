import React, { useState, useEffect } from 'react';

const Kline = (symbol, currency) => {
    const [tick, setTick] = useState({});
    const [price, setPrice] = useState(0);
    const [change, setChange] = useState(0);
    
    const symbolKline = (symbol, currency) => { 
        const symbolCurrency = `${symbol.toLowerCase()}${currency}`;
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/klines/${symbolCurrency}`);
        ws.onopen = () => {
            ws.send(symbolCurrency);
        };
        ws.onmessage = (event) => {
            // console.log(event)
            let incomingTick = JSON.parse(event.data);
            // console.log(incomingTick)
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
        symbolKline(symbol, currency)
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

export default Kline;