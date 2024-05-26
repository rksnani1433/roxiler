import React from 'react';
import './index.css';

let months=["January", "February", "March","April","May","June", "July", "August", "Septembe", "October", "November", "December"]


const Statistics = ({ staticData }) => {
  // Check if staticData is undefined
  if (!staticData) {
    return <div>Loading...</div>;
  }

  const { jsonData, selectedMonth } = staticData;
  const {statistics} = jsonData
  
  return (
    <div className='static-container'>
      <p>Statistics- {months[parseInt(selectedMonth)-1]}</p>
      <div className='data-container'>
        {/* Check if statistics is undefined */}
        {statistics ? (
          <>
            <div className='data'><p>Total Sale</p> <p>{statistics.totalSaleAmount}</p></div>
            <div className='data'><p>Total Sold Items</p> <p>{statistics.totalSoldItems}</p></div>
            <div className='data'><p>Total Not Sold Items</p> <p>{statistics.totalNotSoldItems}</p></div>
          </>
        ) : (
          <div>No statistics available</div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
