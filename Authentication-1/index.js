//Import Reuired Functionalities 
const express = require('express');
const app = express();
const router = require('./routes/router');
const cookieParser = require('cookie-parser');
require('dotenv').config();

//Server Port
const PORT = process.env.PORT || 8000;

//Adding Middleware
app.use(express.json());
app.use(cookieParser());

//Mapping Route & Mount
app.use('/api/v1/user',router);

//Start Server 
app.listen(PORT,()=>{
    console.log('App Started at Port : ',PORT);
});

//Client Side
app.get('/',(req,res)=>{
    res.send('<h1>Assignment 1</h1>')
})

//Database Connection
require('./config/database').connect();