const express=require("express");
const Auth = require("../controllers/authController");
const Rout= express.Router();

Rout.post("/register",Auth.register);
Rout.get("/verify/:token",Auth.emailVerfied);
Rout.post("/login",Auth.login)
Rout.post("/forgetPassword",Auth.forgetPassword);
Rout.post("/resetPassword/:token",Auth.restPassword);
module.exports={Rout};