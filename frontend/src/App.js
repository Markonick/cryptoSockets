import React, { useState, useEffect } from 'react';
import CustomPagination from './CustomPagination'
import SearchCoin from './SearchCoin'
import TickTableHead from './TickTableHead'
import TickCard from './TickCard';
import TimeSeries from './TimeSeries';
import GetSymbolId from './GetSymbolId';
// import CreateTickCards from './CreateTickCards'
import './App.css';
import { CardHeader } from '@material-ui/core';

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
  "KNDC" , "delta", "pib"  , "opt"  , "acdc", "eth",
]

function App() {
  
  const [page, setPage] = useState(1)
  const [symbol, setSymbol] = useState("")
  const [cards, setCards] = useState([])
  const [series, setSeries] = useState([])
  // const [tickCards, setTickCards] = useState()

  const pageCount = Math.ceil(symbols.length/PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const handlePageChange = (event, value) => {
    setPage(value)
  };

  const handleSymbolSearch = event => {
    setSymbol(event)
  };

  useEffect(() => {
    let filteredSymbols = symbols.filter(element => element.includes(symbol));

    if(filteredSymbols.length > 0) {
      setSymbol(symbol)
      CreateTickCards(symbols.filter(element => element.includes(symbol)), "usdt")
    } 
  }, [symbol])

  const CreateTickCards = (symbols, currency) => {
      console.log('RUNNING CARD CALC')
      const tickCards =  symbols.map((symbol, i) => { 
        const miniSeries = <TimeSeries params={{symbol: `${symbol}${currency}`.toUpperCase(), interval: "1m", limit: 100}}/>
        
        return <TickCard symbol={symbol} id={GetSymbolId(symbol)} miniSeries={miniSeries} currency={currency}/>
      })
      setCards(tickCards)
  
      // return tickCards
    }
  useEffect(() => {CreateTickCards(symbols, "usdt")}, [page])
  // const cards = CreateTickCards(symbols.slice(start, end), "usdt")
  let paginatedCards = cards.slice(start, end)
  let tickTableHead = <TickTableHead items={['Symbol', 'Price', 'Change', 'Mini-Series', '+/-']} />

  return (
    <div className="App">
      <header className="App-header">
        <SearchCoin func={handleSymbolSearch} />
        <p>
          <CustomPagination count={pageCount} page={page} func={handlePageChange}></CustomPagination>
        </p>    
        {[tickTableHead, ...paginatedCards]}
      </header>
    </div>
  );
}

export default App;
