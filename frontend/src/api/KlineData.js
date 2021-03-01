import { useEffect, useState } from 'react'
import ApiCore from './utilities/Core'

const apiKline = new ApiCore({
  getAll: true,
  url: 'klines',
});

function KlineData(params) {
  const [data, setData] = useState()

  useEffect(() => {
    setInterval(async () => { 
      getDataPoints()
    }, 5000);
  }, [])

  function getDataPoints() {
    apiKline.getAll(params).then((res) => {
      setData(res)
    })
  }

  function parseData(data) {
    return data.map((item) => {
      // Parse data information
      return item
    })
  }

  return data
};

export default KlineData;