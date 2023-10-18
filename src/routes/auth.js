const express=require("express");
const Auth = require("../controllers/authController");
const Rout= express.Router();

Rout.post("/register",Auth.register);

module.exports={Rout};