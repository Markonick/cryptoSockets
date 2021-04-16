import React, { useState, useEffect } from 'react';

const Tick = (props) => {
    const [tick, setTick] = useState({});
    const [price, setPrice] = useState(0);
    const [change, setChange] = useState(0);
    // console.log(props.symbol)
    const symbolTicker = (symbol, currency) => {
        console.log("!!!!!!!!!!!!!!!!!!!!  inside symbolticker  !!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!  inside symbolticker  !!!!!!!!!!!!!!!!!!")
        const symbolCurrency = `${symbol.toLowerCase()}${currency}`;
        const ws = new WebSocket(`ws://127.0.0.1:8004/ws/tickers/${symbolCurrency}`);
        ws.onopen = () => {
            ws.send(symbolCurrency);
        };
        ws.onmessage = (event) => {
            // console.log(event)
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
        console.log("!!!!!!!!!!!!!!!!!!!!  inside useEFFECT  !!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!  inside useEFFECT  !!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!  inside useEFFECT  !!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!  inside useEFFECT  !!!!!!!!!!!!!!!!!!")
        symbolTicker(props.symbol, props.currency)
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

    // return <div>{{ price: price }}</div>
    console.log(tick)
    // return { price: price }
    return <div>{ price }</div>
    // return <li key="crypto">{price}{change}</li>
};

export default Tick;