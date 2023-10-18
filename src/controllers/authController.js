const { roleModel } = require("../models/role");
const { userModel } = require("../models/user");
const bcrypt = require('bcrypt'); 


class Auth{
  static async registerRole(req,res){
    const role = await roleModel.findOne({ name: 'client' }); 
      try{
   const  {name} =req.body
         const newRole= new roleModel({
          name
         })
         await newRole.save();

      }catch(erreur){
            console.log(erreur)
      }
  }
  static async register(req,res){

    try{
        console.log(req.body,"here")
const {name, email, password, phoneNumber, address, image, role}=req.body
    console.log(name, email, password, phoneNumber, address, image, role);
          const existUser= await userModel.findOne({email});
          if(existUser){
               return res.json("{ message: 'Cet utilisateur existe déjà.' }");
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
            role:role._id,
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