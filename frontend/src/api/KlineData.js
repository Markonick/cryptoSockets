import React, { useEffect, useState } from 'react'
import ApiCore from './utilities/Core'

const apiKline = new ApiCore({
  getAll: true,
  url: 'klines',
});

export default function KlineData() {
  const [data, setData] = useState([])

  useEffect(() => {
    getDataPoints()
  }, [])

  function getDataPoints() {
    apiKline.getAll().then((res) => {
      let data = parseData(res.results.data)
      console.log(data)
      setData(data)
    })
  }

  function parseData(data) {
    return data.map((item) => {
      // Parse data information
      return item
    })
  }

  return data
}