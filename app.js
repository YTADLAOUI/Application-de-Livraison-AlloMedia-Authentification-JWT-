const express = require('express');
require("dotenv").config();
const bodyParser=require("body-parser");
const ConnectionDb = require('./src/database/db');
const { Rout } = require('./src/routes/auth');
const app=express();



 app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());


const PORT=process.env.SERVER_PORT || 3000;

 app.use("/api/auth",Rout);
ConnectionDb.connectDatabase();
app.listen(PORT,()=>{
  console.log(`server run in PORT ${PORT}...`)
})


