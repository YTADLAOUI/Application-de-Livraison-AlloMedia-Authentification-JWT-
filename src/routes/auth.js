const express=require("express");
const Auth = require("../controllers/authController");
const Rout= express.Router();

Rout.post("/register",Auth.register);
Rout.get("/verify/:token",Auth.emailVerfied);
Rout.post("/forgetPassword",Auth.forgetPassword);
module.exports={Rout};