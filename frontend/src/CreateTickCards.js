import React, {useState, useEffect} from "react";
import TickCard from './TickCard';
import TimeSeries from './TimeSeries';
import GetSymbolId from './GetSymbolId';

const CreateTickCards = (symbols, currency) => {
  const [cards, setCards] = useState([])
  const [series, setSeries] = useState([])

    console.log('RUNNING CARD')
    const tickCards =  symbols.map((symbol, i) => { 
      let params = {symbol: `${symbol}${currency}`.toUpperCase(), interval: "1m", limit: 100}
      console.log(params)
      const miniSeries = <TimeSeries params={params}/>
      let id = GetSymbolId(symbol)
      setCards([...cards, tickCards])
      setSeries([...series, miniSeries])

      return <TickCard symbol={symbol} id={id} miniSeries={series} currency={currency}/>
    })

    return tickCards
  }

  export default CreateTickCards