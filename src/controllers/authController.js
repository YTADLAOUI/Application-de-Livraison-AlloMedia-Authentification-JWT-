const { roleModel } = require("../models/role");
const { userModel } = require("../models/user");
const{jwt}=require("jsonwebtoken");
const {cookie}= require("cookies-parser");
const bcrypt = require('bcrypt'); 
const Config = require("../config/config");


class Auth{
  static async register(req,res){
    try{
        // console.log(req.body,"here")
const {name, email, password, phoneNumber, address, image, role}=req.body

        if(!name.trim()|| !email.trim()|| !password.trim()|| !phoneNumber.trim()|| !address.trim()|| !image.trim()|| !role.trim()){
          return res.json({message:"s'il vous plait remplie tout les champs"})
        }

    const role1 = await roleModel.findOne({ name:role  });
          const existUser= await userModel.findOne({email});
          if(existUser){
               return res.json({ message: 'Cet utilisateur existe déjà.' });
          }
          const saltRounds=10;
          const passwordHashed= await bcrypt.hash(password,saltRounds);
          const newUser= new userModel({
            name,
            email,
            password: passwordHashed,
            phoneNumber,
            address,
            image,
            role:role1._id,
            isEmailVerfied:false,
            isVerified: role === 'livreur' ? false : true, 
            isDeleted: false,
          });
          const saved_user = await newUser.save();
         
          
          const Token = Config.generateToken(saved_user , '10m');  
           const linkSend = `${process.env.BASE_URL}/api/auth/verify/${Token}`
           await Config.sendEmail(email,"Verificaiton",linkSend);
         
              return res.json({message:"check your email"})
    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors de l'inscription." });
    }
  }
      static async emailVerfied(req,res){
        const token=  req.params.token
              if(!token) return res.json({ error: 'Access expierd' });
             const verfie=  Config.validateToken(token);
             if(!verfie.success) return res.json({ error: 'Access not valide' });
             console.log(verfie)
        try{
          console.log(verfie.data.user._id)
          const _id = verfie.data.user._id;
            const update=await userModel.updateOne({_id},{isEmailVerfied:true});
            res.json({ success: 'Account activated successfully' });
        }catch(err){
          console.log(err)
              return res.json({message:"update faild"});
        }
              
      }
  static async login(req,res){
    try{
    const {email,password}=req.body
      if(!email.trim() || !password.trim()){
        res.json({message:"s'il vous plait remplait touts les champs"})
      }
        const user= await userModel.findOne(email);
        if(user &&(await bcrypt.compare(password , userModel.password))){
         
            if(user.isEmailVerfied){
            return  res.json({message:"your account verfiée"})
            }else{
              res.json({message: "check your email"})
            }
        }else {
          res.json({message: "informaiton "})
        }

    }catch(erreur){
      console.log(erreur);
    }

  }
}

module.exports=Auth;