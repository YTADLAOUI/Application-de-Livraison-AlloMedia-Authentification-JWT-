const jwt =require("jsonwebtoken");
const nodemailer= require("nodemailer")
class Config{
  static generateToken(user,duree){

    // console.log(process.env.USER)
    return jwt.sign({user},process.env.JWT_SECRET,{
      expiresIn: duree,
    })

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
                    <p>Thank you for signing up. Please verify your email address to activate your account:</p>
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

          }
  }
}
module.exports=Config;