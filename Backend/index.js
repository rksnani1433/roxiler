    const express = require('express');
    const cors= require('cors');
    const path = require('path');
    const sqlite= require('sqlite');
    const {open}= require('sqlite');
    const sqlite3= require('sqlite3');
    const axios= require('axios');
    const app = express();
    app.use(cors())
    
    app.use(express.json());
    
    const dbpath = path.join(__dirname, 'Roxilerdb.db')
    const httpresponse = require('http');

    let db= null

    const initializeDbServer = async () => {
        try {
            db = await open({ filename: dbpath, driver: sqlite3.Database });
            console.log('Database connected successfully');
            db.exec('CREATE TABLE IF NOT EXISTS Taksk ( id INTEGER PRIMARY KEY , title VARCHAR, price INT, description VARCHAR, category VARCHAR, image VARCHAR, sold BOOLEAN, dateOfSale DATETIME);');

            app.listen(3000, () => console.log('Server Running at http://localhost:3000/'));
        
        } catch (error) {
            console.log(`Failed to connect ${error.message}`);
            process.exit(1);
        }
    };

    // const fetchannInsertData= async()=>{

    //     try {
    //         const api= 'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    //     const result= await  axios.get(api)
    //     const data= result.data
    //     for(const item of data) {
    //     const dataItem= `SELECT * FROM Taksk WHERE   id=${item.id}`
    //         const exisitData= await db.get(dataItem)
    //         if(!exisitData){
    //         await db.run('INSERT INTO Taksk (title, price, description, category, image, sold, dateOfSale) VALUES (?,?,?,?,?,?,?)', [item.title, item.price, item.description, item.category, item.image, item.sold, item.dateOfSale])
    //         }
    //         else{
    //             console.log('Data already exist')
    //         }

    //     }
    //     console.log('Data inserted successfully')
    //     } catch (error) {
    //         console.log(`Failed to fetching and inserting data: ${error.message}`);
    //         process.exit(1);
    //     }

    // }

    // function callings

    initializeDbServer();
    // fetchannInsertData()






    


    app.get('/tasks',async (req, res) => {
        
        const {month} = req.query
        try {
            const getTasksQuery= `SELECT *   FROM Taksk  WHERE strftime('%m', dateOfSale) = '${month}'`
            const tasks= await db.all(getTasksQuery)
            if(tasks.length){
                // res.send(tasks)
                res.status(200).json(tasks)
                
            }
            else{
                res.sendStatus(404)
            }
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    })

    app.get('/tasks/:taskId', async(req, res)=>{
        try {
            const taskId= req.params.taskId
            const getTaskQuery= `SELECT * FROM Taksk WHERE id=${taskId}`
            const task= await db.get(getTaskQuery)
            if(task){
                res.status(200).json(task)

            }
            else{
                res.status(404)
            }


        } catch (error) {
            res.send({message:`FEtching Task Failed : ${error.message}`})
            res.status(404).json({message: error.message});
        }
    })

    app.get('/statistics', async (req, res) => {
        try {
            const { month } = req.query;
    
            // Calculate total sale amount for the selected month across all years
            const totalSaleAmountQuery = `SELECT SUM(price) AS totalSaleAmount 
                                          FROM Taksk 
                                          WHERE strftime('%m', dateOfSale) = '${month}'`;
            const totalSaleAmountResult = await db.get(totalSaleAmountQuery);
            const totalSaleAmount = totalSaleAmountResult.totalSaleAmount || 0;
    
            // Calculate total number of sold items for the selected month across all years
            const totalSoldItemsQuery = `SELECT COUNT(*) AS totalSoldItems 
                                         FROM Taksk 
                                         WHERE strftime('%m', dateOfSale) = '${month}' AND sold = 1`;
            const totalSoldItemsResult = await db.get(totalSoldItemsQuery);
            const totalSoldItems = totalSoldItemsResult.totalSoldItems || 0;
    
            // Calculate total number of not sold items for the selected month across all years
            const totalNotSoldItemsQuery = `SELECT COUNT(*) AS totalNotSoldItems 
                                            FROM Taksk 
                                            WHERE strftime('%m', dateOfSale) = '${month}' AND sold = 0`;
            const totalNotSoldItemsResult = await db.get(totalNotSoldItemsQuery);
            const totalNotSoldItems = totalNotSoldItemsResult.totalNotSoldItems || 0;
    
            res.json({
                totalSaleAmount,
                totalSoldItems,
                totalNotSoldItems
            });
        } catch (error) {
            console.error('Error fetching statistics:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    


    

app.get('/api/bar_chart', async (req, res) => {
    // Get the selected month from the request body
    const { month } = req.query;

    // Prepare the SQL query to get the price range and the number of items in that range
    const sqlQuery = `
        SELECT
            CASE
                WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
                WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
                WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
                WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
                WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
                WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
                WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
                WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
                WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
                ELSE '901-above'
            END AS price_range,
            COUNT(*) AS num_items
        FROM Taksk
        WHERE strftime('%m', dateOfSale) = ?
        GROUP BY price_range
        ORDER BY MIN(price);
    `;

    try {
        // Execute the query with the selected month
        const response = await db.all(sqlQuery, [month]);

        if (!response || response.length === 0) {
            res.status(404).json({ status: '404 Not Found' }); // Send 404 status with JSON response   
        } else {
            res.status(200).json(response); // Send JSON response with status 200
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






app.get('/api/pie_chart', async (req, res) => {
    // Get the selected month from the query parameters
    const { month } = req.query;

    // Prepare the SQL query to find unique categories and the number of items for the selected month
    const sqlQuery = `
        SELECT category, COUNT(*) AS num_items
        FROM taksk
        WHERE strftime('%m', dateOfSale) = '${month}'
        GROUP BY category;
    `;
    
    try {
        // Execute the query with the selected month
        const response = await db.all(sqlQuery);
        // console.log(sqlQuery)
        // Send the formatted response
        res.json(response);
        
    } catch (error) {
        // console.log(sqlQuery)
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// API endpoint to list all transactions with search and pagination
app.get('/transactions', async (req, res) => {
    try {
        const { search = '', page = 1, perPage = 10 } = req.query;
        const offset = (page - 1) * perPage;
        const encodedSearchParam = encodeURIComponent(search);

        const searchparams= !isNaN(encodedSearchParam) ? parseInt(encodedSearchParam) : encodedSearchParam;


        let query = `
            SELECT * FROM taksk
            WHERE 
                title LIKE '%${encodedSearchParam}%'
            ORDER BY id ASC
            LIMIT ${perPage} OFFSET ${offset}
        `;
   // OR description LIKE '%${searchparams}%'
        if (search=="") {
            query = `
                SELECT * FROM taksk
                ORDER BY id ASC
                LIMIT ${perPage} OFFSET ${offset}
            `;
        }
        else if(typeof searchparams==='number') {

             query = `SELECT * FROM taksk WHERE PRICE LIKE '${encodedSearchParam}%' ORDER BY id ASC LIMIT ${perPage} OFFSET ${offset}`;

        }

        const transactions = await db.all(query);
        // res.json(transactions);/
        if(!transactions){
            res.status(404).json({ message: 'No transactions found' });
        }
        else{
            res.status(200).json(transactions)
        }
        console.log(searchparams)
        console.log(search)

    } catch (error) {
       
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/combined_data', async (req, res) => {
    try {
        // Get the month from the query parameters
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        // Define the URLs for the three APIs using the provided month parameter
        const statisticsUrl = `http://localhost:3000/statistics?month=${month}`;
        const barChartUrl = `http://localhost:3000/api/bar_chart?month=${month}`;
        const pieChartUrl = `http://localhost:3000/api/pie_chart?month=${month}`;
        const tabledataUrl = `http://localhost:3000/tasks?month=${month}`;

        // Fetch data from all three APIs concurrently
        const [statisticsResponse, barChartResponse, pieChartResponse, tabledataUrlResponse] = await Promise.all([
            axios.get(statisticsUrl),
            axios.get(barChartUrl),
            axios.get(pieChartUrl),
            axios.get(tabledataUrl)
        ]);

        // Extract data from responses
        const statisticsData = statisticsResponse.data;
        const barChartData = barChartResponse.data;
        const pieChartData = pieChartResponse.data;
        const tabledataUrlData = tabledataUrlResponse.data;

        // Combine the responses into a single object
        const combinedData = {
            statistics: statisticsData,
            barChart: barChartData,
            pieChart: pieChartData,
            tableData:tabledataUrlData
        };

        // Send the combined JSON response
        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});