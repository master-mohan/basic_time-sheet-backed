const { employeeSchema } = require("../../helper/employee-schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const employeeLogin = async (req, res,next) => {
  const { username, password } = req.body;
  console.log(username,password);
  try {
    const employee = await employeeSchema.findOne({ phoneNo: username });
    if (employee) {
      if (bcrypt.compare(password, employee.password)) {
        const token = await jwt.sign(
          {
            id: employee._id,
            employeeName: employee.employeeName,
            phoneNo: employee.phoneNo,
            role: employee.role,
          },
          process.env.JWT_SECRET_KEY
        ); //{expiresIn:'1h'}

        await employeeSchema.updateOne(
          { phoneNo: employee.phoneNo },
          { $set: { jwtToken: token } }
        );

        const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        res
          .status(200)
          .json({ message: "login successfull", user, token: token });
      } else {
        res.status(400).json({ Message: "Incorrect password" });
      }
    } else {  
      res
        .status(400)
        .json({ Message: "User Not Found. Enter valid email/password" });
    }
  } catch (error) {
    console.log("error====", error);
    res.status(400).json({ "error occurred": error.message });
  }
};

module.exports = { employeeLogin };
