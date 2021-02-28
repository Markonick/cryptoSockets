import React, { useState, useEffect } from 'react';
import TickCard from './TickCard';
import GetSymbolId from './GetSymbolId'
import CustomPagination from './CustomPagination'
import Search from './Search'
import TimeSeries from './TimeSeries'
import TickTableHead from './TickTableHead'
import './App.css';

const PAGE_SIZE = 10
const symbols = [
  "btc"  , "xrp"  , "doge" , "xlm"  , "trx"  , "vet"  , "sc"   , "btt"  , "dash" , "xtz"  , 
  "eos"  , "ltc"  , "miota", "xmr"  , "link" , "bch"  , "bnb"  , "ada"  , "usdt" , "dcn"  , 
  "etn"  , "rdd"  , "strax", "npxs" , "glm"  , "tfuel", "xvg"  , "rvn"  , "bat"  , "dot"  ,
  "aave" , "sol"  , "atom" , "cro"  , "ht"   , "theta", "luna" , "neo"  , "ftt"  , "dai"  ,
  "mkr"  , "snx"  , "algo" , "ksm"  , "comp" , "egld" , "fil"  , "leo"  , "sushi", "dcr"  ,
  "vgx"  , "ftm"  , "zec"  , "rune" , "cel"  , "ren"  , "nexo" , "zrx"  , "okb"  , "waves",
  "rev"  , "icx"  , "hbar" , "chsb" , "iost" , "dgb"  , "ont"  , "bnt"  , "nano" , "matic",
  "zks"  , "lrc"  , "omg"  , "pax"  , "husd" , "xwc"  , "zen"  , "btmx" , "qtum" , "hnt"  ,
  "KNDC" , "delta", "pib"  , "opt"  , "acdc"
]

function App() {
  
  const [page, setPage] = useState(1)
  const [symbol, setSymbol] = useState("")
  const [tickCards, setTickCards] = useState()

  const pageCount = Math.ceil(symbols.length/PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const currency = "usdt"

  const handlePageChange = (event, value) => {
    setPage(value)
  };

  const handleSymbolSearch = event => {
    setSymbol(event.target.value)
  };

  const createTickCards = (symbols) => {
    console.log('RUNNING CARD CALC!!!!!')
    const tickCards =  symbols.map((symbol, i) => { 
      let params = {symbol: `${symbol}${currency}`.toUpperCase(), interval: "1m", limit: 100}
      const miniSeries = <TimeSeries params={params}/>
      let id = GetSymbolId(symbol)
      return <TickCard symbol={symbol} id={id} miniSeries={miniSeries} currency={currency}/>
    })

    return tickCards
  }
  
  const cards = createTickCards(symbols)
  let paginatedCards = cards.slice(start, end)
  console.log(paginatedCards)
  let tickTableHead = <TickTableHead items={['Symbol', 'Price', 'Change', 'Mini-Series', '+/-']} />

  return (
    <div className="App">
      <header className="App-header">
        <Search func={handleSymbolSearch} />
        <p>
          <CustomPagination count={pageCount} page={page} func={handlePageChange}></CustomPagination>
        </p>    
        {[tickTableHead, ...paginatedCards]}
      </header>
    </div>
  );
}

export default App;
