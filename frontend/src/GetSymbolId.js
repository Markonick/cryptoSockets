import React, { useState, useEffect } from 'react'
import json from './coinmarketcapMap.json'
 
function GetSymbolId(symbol) {
  const [data, setData] = useState(json)
  return data.data.filter(item => item.symbol === symbol.toUpperCase()).map((item) => item.id)
}

export default GetSymbolId;