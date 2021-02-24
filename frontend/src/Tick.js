import React, { useState, useEffect } from 'react';

const Tick = (symbol, currency) => {
    const [tick, setTick] = useState({});
    const [previousTick, setPreviousTick] = useState({});
    const [tickBuffer, setTickBuffer] = useState([]);
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        const subscribe = {
            "method": "SUBSCRIBE",
            "params": [
                `${symbol.toLowerCase()}${currency}@ticker`,
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
            const buffer = fifo(2, incomingTick)
            setTickBuffer(buffer)
            let calculatedDiff = calcDiff(Number(tickBuffer[0].c), Number(incomingTick.c))
            setDiff(calculatedDiff.toFixed(7))
            setTick(incomingTick)
            setPreviousTick(tickBuffer[0])
        };
        ws.onclose = () => {
            ws.close();
        };

        return () => {
            ws.close();
        };
    }, []);

    const calcDiff = (prevPrice, newPrice) => {
        let diff = 0
        if (tickBuffer.length === 2) {
            diff = newPrice - prevPrice
        }

        return diff
    }

    const fifo = (size, incomingTick) => {
        let tempBuffer = tickBuffer
        tempBuffer.push(incomingTick)

        if (tempBuffer.length > size) {
            tempBuffer.shift()
        }

        return tempBuffer
    }

    return { price: Number(tick.c), change: diff, }
};

export default Tick;