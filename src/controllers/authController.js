const { userModel } = require("../models/user");
const bcrypt = require('bcrypt'); 


class Auth{
  static async register(req,res){
    try{
const {name, email, password, phoneNumber, address, image, role}=req.body
          const existUser= await userModel.findOne({email});
          if(existUser){
               return res.json("{ message: 'Cet utilisateur existe déjà.' }");
          }
          const saltRound=10;
          passwordHashed=await bcrypt.hash(password,saltRound);
          const newUser= new userModel({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            image,
            role,
            isVerified: role === 'livreur' ? false : true, 
            isDeleted: false,
          });
          await newUser.save();
          if (role === 'client') {
            // Rediriger vers le tableau de bord du client
            res.status(201).json({ message: 'Inscription réussie (client).' });
          } else if (role === 'livreur') {
            // Rediriger vers une page d'attente de validation
            res.status(201).json({ message: 'Votre demande en tant que livreur est en attente de validation.' });
          }

    }catch(error){
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors de l'inscription." });
    }
  }
  async login(){

  }
}
module.exports=Auth;