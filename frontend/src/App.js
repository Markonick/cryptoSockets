import React from 'react';
import TickCard from './TickCard';
import GetSymbolId from './GetSymbolId'
import CustomPagination from './CustomPagination'
import Search from './Search'
import Timeseries from './Timeseries'
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
  
  const [page, setPage] = React.useState(1)
  const [symbol, setSymbol] = React.useState("")

  const handlePageChange = (event, value) => {
    setPage(value)
  };

  const handleSymbolSearch = event => {
    setSymbol(event.target.value)
  };

  let pageCount = Math.ceil(symbols.length/PAGE_SIZE)
  let start = (page - 1) * PAGE_SIZE
  let end = start + PAGE_SIZE
  let currency = "usdt"

  const createTickCards = (symbols) => {
    const tickCards =  symbols.map((symbol, i) => { 
      let params = {symbol: `${symbol}${currency}`.toUpperCase(), interval: "1m", limit: 100}
      const miniSeries = <Timeseries params={params}/>
      let id = GetSymbolId(symbol)
      return <TickCard symbol={symbol} id={id} miniSeries={miniSeries} currency={currency}/>
    })

    return tickCards
  }
  
  let paginatedTickCards = createTickCards(symbols).slice(start, end)
  
  let tickTableHead = <TickTableHead items={['Symbol', 'Price', 'Change', 'Mini-Series', '+/-']} />

  return (
    <div className="App">
      <header className="App-header">
        <Search func={handleSymbolSearch} />
        <p>
          <CustomPagination count={pageCount} page={page} func={handlePageChange}></CustomPagination>
        </p>    
        {[tickTableHead, ...paginatedTickCards]}
      </header>
    </div>
  );
}

export default App;
