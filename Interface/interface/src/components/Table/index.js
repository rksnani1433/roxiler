import React, { useEffect, useState } from 'react';
import Statistics from '../Statistics';
import Barchat from '../Barchat';
import Piechart from '../Piechart';
import './index.css';

let months=["January", "February", "March","April","May","June", "July", "August", "Septembe", "October", "November", "December"]

const Table = () => {
  const [data, setData] = useState([]);
  const [totalData, totalSetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('03');
  const [monthData , setMonthData]=useState('')
  const [piechartData, setPiechartData] = useState([])

  useEffect(() => {
    if (searchTerm ==='') {
      handleSubmit();
    }
  }, [searchTerm]);

  
  async function handleSubmit() {
    try {
      const response = await fetch(`http://localhost:3000/transactions?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchDataAsPerMonth = async (selectedMonth) => {
    if (!selectedMonth) {
      console.error('No month selected');
      return;
    }
  
    // console.log('Fetching data for month:', selectedMonth);
    
    try {
      const response = await fetch(`http://localhost:3000/combined_data?month=${selectedMonth}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
  
      const jsonData = await response.json();
      const { tableData, barChart, pieChart } = jsonData;
  
      setData(tableData);
      totalSetData(barChart);
      setPiechartData(pieChart);
      console.log(pieChart)
      setMonthData({ jsonData, selectedMonth });
      
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
  
  useEffect(() => {
    fetchDataAsPerMonth(selectedMonth);
    
}, [selectedMonth]);


  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };



  return (
    <div className='main-table-container'>
      <div className='header'><h1>Transaction <br/>Dashboard</h1></div>
      <div className='table-data-container'>
        <div>
          <form className="search-bar" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input
              type="text"
              value={searchTerm}
              placeholder="Search..."
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>

         
          <div className='select-container'>
            <label htmlFor="months">Select a Month:</label>
            <select id="months" value={selectedMonth} onChange={handleChange}>
              <option value="">-- Select a Month --</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option selected value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            {selectedMonth && <p>You have selected month : <span style={{fontWeight:'bold'}}>{months[parseInt(selectedMonth)-1]}</span></p>}
          </div>
        
        </div>
        <table className="product-table"> 
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {data.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>
                  <div className="description">
                    <p id="descriptionText">{product.description}</p>
                    <a target='_self' href="#descriptionText" className="read-more">Read more</a>
                  </div>
                </td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.sold}</td>
                <td><img src={product.image} alt={product.title} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Statistics staticData={monthData} />
      <Barchat barchatData={totalData} selectedMonth={months[parseInt(selectedMonth)-1]} />
<Piechart data={piechartData} selectedMonth={months[parseInt(selectedMonth)-1]} />

    </div>
  );
};

export default Table;
