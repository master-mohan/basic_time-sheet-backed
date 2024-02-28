const JWT = require('jsonwebtoken');

const loginInfo = async(authHeader)=>{
  
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(200).json({ Message: "Unable to add Emkployee details" });
    }
    const token = authHeader.split(" ")[1];
    const payload = await JWT.verify(token, process.env.JWT_SECRET_KEY);
    
    return payload;
}
module.exports = {loginInfo};