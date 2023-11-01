const { validateToken } = require("../services/AuthService");

class UserMiddle{ 
  static alreadyLogged(req,res,next){
         const token =req.cookies.token
        //  console.log('hhhhhhh');
         console.log(token)
         if(token) {
          // console.log('YYYYY')
           const verify=validateToken(token)
           console.log(verify.success);
          if(verify.success) return next()
        }
        return  res.json({message:"you should loggin"})
  }
     static previouslyLogged(req,res,next){
      const token =req.cookies.token
      if(!token) return next();
       const verify=validateToken(token)
      if(!verify.success) return next();
      return res.json({message:"you are already loggin"})
     }
}
module.exports=UserMiddle;