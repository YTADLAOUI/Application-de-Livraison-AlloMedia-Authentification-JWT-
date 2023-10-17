const express = require('express');
const dotenv=require("dotenv");
 const bodyParser=require("body-parser");
const ConnectionDb = require('./src/database/db');


const app=express();

dotenv.config();
const PORT=process.env.SERVER_PORT || 3000;
 app.use(bodyParser.urlencoded({extended:true}))
 
ConnectionDb.connectDatabase();
app.listen(PORT,()=>{
  console.log(`server run in PORT ${PORT}...`)
})






