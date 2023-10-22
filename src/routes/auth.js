const express=require("express");

const Auth = require("../controllers/authController");
const UserMiddle = require("../middlewares/alreadyLogged");
const Rout= express.Router();

Rout.post("/register",UserMiddle.previouslyLogged,Auth.register);
Rout.post("/logout",UserMiddle.alreadyLogged,Auth.logout);
Rout.get("/verify/:token",Auth.emailVerfied);
Rout.post("/login",UserMiddle.previouslyLogged,Auth.login)
Rout.post("/forgetPassword",UserMiddle.previouslyLogged,Auth.forgetPassword);
Rout.post("/resetPassword/:token",Auth.restPassword);
module.exports={Rout};