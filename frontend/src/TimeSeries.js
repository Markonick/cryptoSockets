import React, { useState, useEffect } from 'react'
import klines from './mockKlines'
import { Line } from 'react-chartjs-2'
import KlineData from './api/KlineData'

const DATA_LEN = 100
// const mockData = klines.map((item)=> item[1]).splice(400,500)

export default function TimeSeries(props) {
  let klineData = KlineData(props.params)
  console.log(klineData)
  let prices = klineData !== undefined ? klineData.map((item)=> item[1]) : ""

  const data = {
    labels: [...Array(DATA_LEN).keys()],
    datasets: [
      {
        data: prices,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        grid: false,
      },
    ]
  };

  const options = 
  {
      responsive: false,
      maintainAspectRatio: true,
      legend: {
          display: false
      },
      elements: {
          point:{
              radius: 0
          }
      },
      scales: {
          xAxes: [{
              display: false,
              ticks: {
                  display: false,
              },
              gridLines: {
                  drawBorder: false,
                  drawOnChartArea: false
              }
          }],
          yAxes: [{
              display: false,
              ticks: {
                  display: false,
              },
              gridLines: {
                  drawBorder: false,
                  drawOnChartArea: false
              }
          }]
      }
  }

  return (
    <div className="App" >
      <Line data={data} width={75} height={50} options={options} />
    </div>
  );
}