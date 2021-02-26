import React from "react";
import klines from './mockKlines'

import { Line } from "react-chartjs-2";
const DATA_LEN = 100
let testData = klines.map((item)=> item[1]).splice(400,500)
console.log(testData)
const data = {
  labels: [...Array(DATA_LEN).keys()],
  datasets: [
    {
    //   label: "First dataset",
    //   data: Array.from({length: DATA_LEN}, () => Math.floor(Math.random() * 1000)),
      data: testData,
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

export default function App() {
  return (
    <div className="App" style={{
        // height: "10px",
        // width:"30%",
        // position: "relative",
         }}>
      <Line data={data} width={75} height={50}
  options={options} />
    </div>
  );
}