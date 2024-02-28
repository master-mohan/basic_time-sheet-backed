const JWT = require("jsonwebtoken");
const { employeeSchema } = require("../helper/employee-schema");
const { loginInfo } = require("./payload-object");

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(400).json({ message: "Authrization Failed"});
  } 
  
  try {
    const token = authHeader.split(" ")[1];
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);
    const user = await employeeSchema.findOne({_id:payload.id});
  
    if(user.jwtToken==token){  

        const response = await loginInfo(req.headers.authorization);
        req.user = response; 
     
        next();
    }else{
      res.status(400).json({ messages: "Authentication failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ messagess: "Authentication failed" });
  }
};


module.exports = { userAuth};

  