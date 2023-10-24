const { roleModel } = require("../models/role");
const { userModel } = require("../models/user");
const bcrypt = require('bcrypt'); 
const Config = require("../config/config");
const AuthService = require("../services/AuthService")


class AuthController{
  static async register(req,res){
    try{
        // console.log(req.body,"here")
const {name, email, password, phoneNumber, address, image, role}=req.body
        if(!name.trim()|| !email.trim()|| !password.trim()|| !phoneNumber.trim()|| !address.trim()|| !image.trim()|| !role.trim()){
          return res.json({message:"s'il vous plait remplie tout les champs"})
        }
       
    const role1 = await roleModel.findOne({ name:role  });

          const isEmailExistr= await AuthService.isEmailExist(email);
          if(isEmailExistr){
               return res.json({ message: 'Cet utilisateur existe déjà.' });
          }

          const passwordHashed= await AuthService.hashPassword(password);
          const newUser= await AuthService.createUser(name,email,passwordHashed,phoneNumber,address,image,role,role1)
          const saved_user = await newUser.save();
         console.log(saved_user);
          const Token =  AuthService.generateToken(saved_user , '10m');  
           const linkSend = `${process.env.BASE_URL}/api/auth/verify/${Token}`
           await AuthService.sendEmail(email,"Verificaiton",linkSend);
              return res.json({message:"check your email"});
    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors de l'inscription." });
    }
  }
      static async emailVerfied(req,res){
        const token=  req.params.token
              if(!token) return res.json({ error: 'Access expierd' });
             const verfie=  AuthService.validateToken(token);
             if(!verfie.success) return res.json({ error: 'Access not valide' });
             console.log(verfie)
        try{
          console.log(verfie.data.user._id)
          const _id = verfie.data.user._id;
            const updateEmailVerfied= await AuthService.updateOne(userModel,{_id:_id},{isEmailVerfied:true});
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
        const user= await AuthService.findOne(userModel,{email:email},"role");
        
        if(user &&(await bcrypt.compare(password,user.password))){
          if(!user.isEmailVerified){
            const loginToken = AuthService.generateToken( user , '48h');
           res.cookie('token', loginToken, { httpOnly: true, secure: true });
           if(user.isVerified){
            res.status(201).json({
                message: `hello ${ user.name }, you are logged in as a ${user.role.name}`,
            });}else{
             return res.json("wait admin approve your role")
            }
        }else{
          const Token = AuthService.generateToken(user , '10m');  
          const linkSend = `${process.env.BASE_URL}/api/auth/verify/${Token}`
          await AuthService.sendEmail(email,"Verificaiton",linkSend);
            res.json({ message : "please check your email "})
        }    
        }else {
          res.json({message: "informaiton incorrecte please check it"})
        }
    }catch(erreur){
      console.log(erreur);
      res.json({message:"login faild"})
    }
  }

   static logout(req, res){
    const token =req.cookies.token
    console.log(token)
    res.clearCookie('token');
    res.json({ success: 'Logged out successfully' });
}
      static async forgetPassword(req,res){
        console.log(req.body)
      try{
        const {email}=req.body;
        if(!email.trim()) return res.json({message:"rempli le champs"})
        const user = await AuthService.findOne(userModel,{email:email},"role");
        if (!user) return res.status(400).json({ error: 'Email is not found' });
        const Token = AuthService.generateToken(user , '10m');  
        const linkSend = `${process.env.BASE_URL}/api/auth/resetPassword/${Token}`
        await AuthService.sendEmail(email,"forgetPassword",linkSend);
        res.json({ success: 'Check your email to reset your password!' });
       }
      catch(err){
        res.json({message:"oki"})
        console.error("Error populating 'role':", err);
      }}
      static async restPassword(req,res){
        try{
          const token= req.params.token
            const {password}=req.body;
          if(!token||!password) return res.json({message:"rempli les champs"})
            const verify= AuthService.validateToken(token);
          if(verify.error) return res.json({message:"token is note work"})
          console.log(verify.data);
            const _id=verify.data.user._id
           const  user= await AuthService.findOne(userModel,{_id:_id})
            console.log(user)
            if(!user) return res.json({message:"user not found 404"})
            const passwordHashed= await AuthService.hashPassword(password)
            updateUser= await AuthService.updateOne(userModel,{_id:_id},{password:passwordHashed})
            return res.json({message:"password update with succss"});
        }catch(err){
            res.json({erreur:"password not change"})
        }    
      }
}

module.exports=AuthController;