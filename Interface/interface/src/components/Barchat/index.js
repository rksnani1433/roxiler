import React from 'react';
import './index.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

let dataList = [
  { price_range: '0 - 100', num_items: 0 },
  { price_range: '101 - 200', num_items: 0 },
  { price_range: '201 - 300', num_items: 0 },
  { price_range: '301 - 400', num_items: 0 },
  { price_range: '401 - 500', num_items: 0 },
  { price_range: '501 - 600', num_items: 0 },
  { price_range: '601 - 700', num_items: 0 },
  { price_range: '701 - 800', num_items: 0 },
];

const Barchat = (props) => {
  // console.log(props);
  // console.log("_---------____------------______-----------cheking")
  const getFullData = () => {
    for (let each of props.barchatData) {
      for (let each1 of dataList) {
        if (each.price_range === each1.price_range) {
          each1.num_items = each.num_items;
        }
      }
    }
  };

  getFullData();

  const DataFormatter = (number) => {
    if (number > 1000) {
      return `${(number / 1000).toString()}k`;
    }
    return number.toString();
  };

  return (
    <div className='bar-main'>
    <ResponsiveContainer className="outer" width="70%" height={450}>
      <h1 style={{color:"white"}}>Bar chart stats - {props.selectedMonth}</h1>
      <BarChart
        data={dataList} // Use dataList directly here
        margin={{
          top: 5,
        }}
      >
        <XAxis
          dataKey="price_range" // Use price_range from dataList
          tick={{
            stroke: 'gray',
            strokeWidth: 1,
          }}
        />
       <YAxis
          domain={[1, 8]} // Set the domain of Y-axis to display from 1 to 8
          tickFormatter={(tick) => tick} // Format tick labels if needed
          tick={{
            stroke: 'gray',
            strokeWidth: 1,
          }}
        />
        <Legend
          wrapperStyle={{
            padding: 30,
          }}
        />
        <Bar dataKey="num_items" name="Items" fill="#1f77b4" barSize="10%" /> {/* Use num_items from dataList */}
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default Barchat;
