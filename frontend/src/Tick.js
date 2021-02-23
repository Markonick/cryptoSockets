import React, { useState, useEffect } from 'react';

const Tick = () => {
    const [tick, setTick] = useState({});
    const [previousTick, setPreviousTick] = useState({});
    const [tickBuffer, setTickBuffer] = useState([]);
    const [diff, setDiff] = useState();

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
            console.log(incomingTick)
            const buffer = fifo(2, incomingTick)
            setTickBuffer(buffer)
            let calculatedDiff = buffer ? buffer.map((item, i) => {
                console.log(item)
                return calcDiff(Number(item.c), Number(incomingTick[i].c))
            } ")
            console.log(calculatedDiff)
            setDiff(calculatedDiff)
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

    useEffect(() => {
        console.log("Price has changed!", tick);
    }, [tick])

    const calcDiff = (prevPrice, newPrice) => {
        let diff = 0
        if(tickBuffer.length === 2){
         diff = newPrice - prevPrice
        }

        return diff
    }

    const fifo = (size, incomingTick) => {
        let tempBuffer = tickBuffer
        tempBuffer.push(incomingTick)

        if(tempBuffer.length > size) {
            tempBuffer.shift()
        }

        return tempBuffer
    }
    
    console.log({change: diff, Price: Number(tick.c) })
    return {change: diff, Price: Number(tick.c) }
};

export default Tick;