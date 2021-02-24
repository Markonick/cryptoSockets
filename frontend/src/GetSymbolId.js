import React, { useState, useEffect } from 'react'
import json from './coinmarketcapMap.json'
import axios from 'axios'
 
function GetSymbolId(symbol) {
  const [data, setData] = useState(json)
  
  const getMappedData = () => data.data.filter(item => item.symbol === symbol.toUpperCase()).map((item) => item.id)

  return getMappedData()
}

export default GetSymbolId;