import React from 'react'
import klines from './mockKlines'
import { Line } from 'react-chartjs-2'
import KlineData from './api/KlineData'

const DATA_LEN = 100
let mockData = klines.map((item)=> item[1]).splice(400,500)

export default function TimeSeries(props) {
let kleinData = KlineData(props.params)
let prices = kleinData !== undefined ? kleinData.map((item)=> item[1]) : ""

const data = {
  labels: [...Array(DATA_LEN).keys()],
  datasets: [
    {
    //   label: "First dataset",
    //   data: Array.from({length: DATA_LEN}, () => Math.floor(Math.random() * 1000)),
      data: prices,
      fill: false,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 1,
      grid: false,
    //   lineTension: 0,
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
            display: false, //this will remove all the x-axis grid lines
            ticks: {
                display: false,
            },
            gridLines: {
                drawBorder: false,
                drawOnChartArea: false
            }
        }],
        yAxes: [{
            display: false, //this will remove all the x-axis grid lines
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