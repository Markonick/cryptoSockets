import React, { useState, useEffect } from 'react';
import CustomPagination from './CustomPagination'
import SearchCoin from './SearchCoin'
import TickTableHead from './TickTableHead'
import TickCard from './TickCard';
import TimeSeries from './TimeSeries';
import GetSymbolId from './GetSymbolId';
// import CreateTickCards from './CreateTickCards'
import './App.css';

const PAGE_SIZE = 10
const symbols = [
  "btc"  , 
  // "xrp"  , "doge" , "xlm"  , "trx"  , 
  // "eos"  , "ltc"  , "miota", "xmr"  , "link" , 
  // "etn"  , "rdd"  , "strax", "npxs" , "glm"  ,
  // "aave" , "sol"  , "atom" , "cro"  , "ht"   ,
  // "mkr"  , "snx"  , "algo" , "ksm"  , "comp" ,
  // "vgx"  , "ftm"  , "zec"  , "rune" , "cel"  ,
  // "rev"  , "icx"  , "hbar" , "chsb" , "iost" ,
  // "zks"  , "lrc"  , "omg"  , "pax"  , "husd" ,
  // "vet"  , "sc"   , "btt"  , "dash" , "xtz"  ,
  // "bch"  , "bnb"  , "ada"  , "usdt" , "dcn"  ,
  // "tfuel", "xvg"  , "rvn"  , "bat"  , "dot"  ,
  // "theta", "luna" , "neo"  , "ftt"  , "dai"  ,
  // "egld" , "fil"  , "leo"  , "sushi", "dcr"  ,
  // "ren"  , "nexo" , "zrx"  , "okb"  , "waves",
  // "dgb"  , "ont"  , "bnt"  , "nano" , "matic",
  // "xwc"  , "zen"  , "btmx" , "qtum" , "hnt"  ,
  // "KNDC" , "delta", "pib"  , "opt"  , "acdc", "eth",
]

function App() {
  const [page, setPage] = useState(1)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(10)
  const [symbol, setSymbol] = useState("")
  const [cards, setCards] = useState([])
  const [series, setSeries] = useState([])

  const pageCount = Math.ceil(symbols.length/PAGE_SIZE)
  // const start = (page - 1) * PAGE_SIZE
  // const end = start + PAGE_SIZE
  console.log(start)
  console.log(end)
  console.log(page)

  // Handle Page Change
  const handlePageChange = (event, value) => {
    console.log('1111111111111111111111')
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    setPage(value)
    setStart(start)
    setEnd(end)
  };

  useEffect(() => {
    console.log('22222222222222222222222')
    const pageSymbols = symbols.slice(start, end)
    console.log(pageSymbols)
    let cards = CreateTickCards(pageSymbols, "usdt")
    setCards(cards)
  },[])

  useEffect(() => {
    console.log('3333333333333333333333333')
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const pageSymbols = symbols.slice(start, end)
    console.log(pageSymbols)
    let cards = CreateTickCards(pageSymbols, "usdt")
    setStart(start)
    setEnd(end)
    console.log(cards)
    setCards(cards)
  }, [page])

  // Handle Search Symbol 
  const handleSymbolSearch = event => {
    console.log('444444444444444444444444')
    setSymbol(event)
  };

  useEffect(() => {
    console.log('555555555555555555555555')
    let filteredSymbolsByText = symbols.filter(element => element.includes(symbol));

    if(filteredSymbolsByText.length > 0) {
      let cards = CreateTickCards(filteredSymbolsByText, "usdt")
      setCards(cards)
    } 
  }, [symbol])


  const CreateTickCards = (symbols, currency) => {
      console.log('RUNNING CARD CALC')
      const tickCards = symbols.map((symbol, i) => { 
        const miniSeries = <TimeSeries symbol={symbol} currency={currency} params={{symbol: `${symbol}${currency}`.toUpperCase(), interval: "1m", limit: 100}}/>
        // const miniSeries = ''
        return <TickCard symbol={symbol} id={GetSymbolId(symbol)} miniSeries={miniSeries} currency={currency}/>
      })
      console.log(tickCards)

      return tickCards
    }

  // let paginatedCards = cards.slice(start, end)
  let tickTableHead = <TickTableHead items={['Symbol', 'Price', 'Change', 'Mini-Series', '+/-']} />

  return (
    <div className="App" >
      <header className="App-header" style={{
      display: 'flex', 
      flexDirection: "column",
      justifyContent: 'start', }}>
        <SearchCoin func={handleSymbolSearch} />
        <p>
          <CustomPagination count={pageCount} page={page} func={handlePageChange}></CustomPagination>
        </p>    
        {[tickTableHead, ...cards]}
      </header>
    </div>
  );
}

export default App;
