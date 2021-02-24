import React from 'react';
import TickCard from './TickCard';
import Tick from './Tick';
import GetSymbolId from './GetSymbolId'
import GetSymbolIds from './GetSymbolIds'
import CustomPagination from './CustomPagination'
import Search from './Search'
// import Ticks from './Ticks';
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
const currencies = ["usdt", "usdt", "usdt", "usdt", "usdt", "usdt", "usdt", ]

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
  console.log(start)
  console.log(end)

  let paginatedSymbols = symbols.slice(start, end)

  const tickCards =  paginatedSymbols.map((symbol, i) => { 
    let id = GetSymbolId(symbol)
    return <TickCard symbol={symbol} id={id} currency={"usdt"}/>
  })

  // let ids = GetSymbolIds()
  
  // let pageCount = Math.ceil(ids.length/PAGE_SIZE)
  // let paginatedSymbols = ids.slice(start, end)
  // const tickCards =  paginatedSymbols.map((item) => { 
  //   return <TickCard symbol={item.symbol} id={item.id} currency={"usdt"}/>
  // })
  
  return (
    <div className="App">
      <header className="App-header">
        <Search func={handleSymbolSearch} />
        <p><CustomPagination count={pageCount} page={page} func={handlePageChange}></CustomPagination>
        </p>    
        {tickCards}
      </header>
    </div>
  );
}

export default App;
