const { userModel } = require("../models/user");
const bcrypt = require('bcrypt'); 
const jwt =require("jsonwebtoken");
const nodemailer= require("nodemailer")
class AuthService{

  static isEmailExist = async (email) => {
    const existUser= await userModel.findOne({email});
    return existUser ? true : false;
  }
   static updateOne = async (model,documentId,fileds) =>{ 
    console.log(fileds);
      return await  model.updateOne(documentId,fileds);
   }
    static findOne =async (model,argg,populate=false)=>{
      const queryFind= await model.findOne(argg)
        if(populate)  return queryFind.populate(populate);
        return queryFind;
    }

  static hashPassword = async (password) => {
    const saltRounds=10;
    return await bcrypt.hash(password, saltRounds);
  }

  static createUser = async (name,email,passwordHashed,phoneNumber,address,image,role,roleID) => {
    return new userModel({
      name,
      email,
      password: passwordHashed,
      phoneNumber,
      address,
      image,
      role:roleID._id,
      isEmailVerfied:false,
      isVerified: role === 'Livreur' ? false : true, 
      isDeleted: false,
    });
  }
  static generateToken(user,duree){
    // console.log(process.env.USER)
    return jwt.sign({user},process.env.JWT_SECRET,{
      expiresIn: duree,
    })
  }
  static async sendEmail(email,subject,link){
    try{
         let transport = nodemailer.createTransport({
        host:process.env.HOST,
        port: 2525,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Email ${subject}</title>
      </head>
      <body>
          <div>
              <p>${subject=="Verificaiton"?"Thank you for signing up. Please verify your email address to activate your account":"click sur link for reset password"}</p>
              <p><a href="${link}">Entre ici</a></p>
            
          </div>
      </body>
      </html>
    `;
      
      
    await transport.sendMail({
      from: "usftadlaoui@gmail.com",
      to: email,
      subject: subject,
      html: html,
    });
    console.log("Email sent successfully");
    }catch(err){
      console.log("Email Filed send");
    }
}
static validateToken(token) {
  try{
      let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      let obj = {"success": "Token is valid", "data": decodedToken};
      return obj;
  } catch (err) {
      return {"error": "Token is invalid"}
  }
}

}

module.exports = AuthService;