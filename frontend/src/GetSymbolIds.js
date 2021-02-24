import React, { useState, useEffect } from 'react'
import json from './coinmarketcapMap.json'
import axios from 'axios'
 
function GetSymbolIds() {
  const [data, setData] = useState(json)
  
  const getMappedData = () => data.data.map((item) => {
      return {id: item.id, symbol: item.symbol}
    })

  return getMappedData()
}

export default GetSymbolIds;