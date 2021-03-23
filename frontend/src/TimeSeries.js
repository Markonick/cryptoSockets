import React, { useState, useEffect } from 'react'
import klines from './mockKlines'
import { Line } from 'react-chartjs-2'
import KlineData from './api/KlineData'
import Tick from "./Tick";

const DATA_LEN = 100-1

export default function TimeSeries(props) {
  console.log(KlineData(props.params))
  const klineData = [1.2,3] //KlineData(props.params)
  let prices = klineData !== undefined ? klineData.map((item)=> item[1]) : ""
  
  const fifo = (buffer, size, incomingTick) => {
    buffer.push(incomingTick.price)
   
    if (buffer.length > size) {
      buffer.shift()
    }

    return buffer
  }

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
      responsive: true,
      maintainAspectRatio: true,
      padding: {
          right: 50,
          left: 50,
          top: 50,
          bottom: 50,
      },
      tooltips: {
        tooltipFontSize: 8,
        // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>hrs",
        // cutoutPercentage: 60,
        // percentageInnerCutout : 70,
        backgroundColor: '#000',
        titleFontSize: 8,
        titleFontColor: '#0066ff',
        bodyFontColor: '#fff',
        bodyFontSize: 8,
      },
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