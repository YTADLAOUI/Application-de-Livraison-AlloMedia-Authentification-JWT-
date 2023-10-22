const { validateToken } = require("../config/config");

class UserMiddle{
   
  static alreadyLogged(req,res,next){
         const token =req.cookies.token
         console.log(token)
         if(token) {
           const verify=validateToken(token)
           console.log(verify.success);
          if(verify.success) return next()
        }
        return  res.json({message:"you shold loggin"})
  }
     static previouslyLogged(req,res,next){
      const token =req.cookies.tok
      if(!token) return next();
       const verify=validateToken(token)
      if(!verify.success) return next();
      return res.json({message:"you are already loggin"})
     }
}
module.exports=UserMiddle;