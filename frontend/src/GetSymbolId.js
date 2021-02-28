import React, { useState, useEffect } from 'react'
import data from './coinmarketcapMap'
 
function GetSymbolId(symbol) {
  // const [data, setData] = useState(json)
  return data.filter(item => item.symbol === symbol.toUpperCase()).map(item => item.id)
}

export default GetSymbolId;