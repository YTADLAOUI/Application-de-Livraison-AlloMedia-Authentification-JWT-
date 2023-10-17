const express = require('express');
const dotenv=require("dotenv");
const app=express();
dotenv.config();
const PORT=process.env.SERVER_PORT || 3000;

app.get("/",(req,res)=>{
res.send("hello from server");
})

app.listen(PORT,()=>{
  console.log(`server run in PORT ${PORT}...`)
})






