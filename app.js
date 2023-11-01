const express = require('express');
require("dotenv").config();
const bodyParser=require("body-parser");
const jwt = require('jsonwebtoken');
const cors=require('cors')
const cookieParser = require('cookie-parser');
const ConnectionDb = require('./src/database/db');
const { Rout } = require('./src/routes/auth');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
const PORT=process.env.SERVER_PORT || 8000;
app.use(cors({
  origin:"http://localhost:3000"
}))

 app.use("/api/auth",Rout);
ConnectionDb.connectDatabase();
app.listen(PORT,()=>{
  console.log(`server run in PORT ${PORT}...`)
})


