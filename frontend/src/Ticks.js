import React, { useState, useEffect } from 'react';

const Ticks = () => {
    const [price, setPrice] = useState(0);
    const [change, setChange] = useState(0);

    useEffect(() => {
        const subscribe = {
            "method": "SUBSCRIBE",
            "params": [
                "!ticker@arr",
            ],
            "id": 1
        }

        const ws = new WebSocket('wss://stream.binance.com:9443/ws');
        ws.onopen = () => {
            ws.send(JSON.stringify(subscribe));
        };
        ws.onmessage = (event) => {
            let incomingTick = JSON.parse(event.data);
            for(tick in incomingTick){
                
            }
            let oldPrice = price;
            let newPrice = Number(incomingTick.c)
            console.log(newPrice)
            let calculatedChange = calcChange(oldPrice, newPrice)

            setChange(calculatedChange.toFixed(2))
            setPrice(newPrice)
        };
        ws.onclose = () => {
            ws.close();
        };

        return () => {
            ws.close();
        };
    }, []);

    const calcChange = (prevPrice, newPrice) => {
        let change = newPrice - prevPrice
        console.log(newPrice)
        console.log(prevPrice)

        return change
    }

    return { change: change, price: price }
};

export default Ticks;