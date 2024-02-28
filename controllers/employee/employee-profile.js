const { employeeSchema } = require("../../helper/employee-schema");

//display the requested employee details
let employeeProfile = async (req, res) => {

    try {
        const present = await employeeSchema.find({ _id: req.user.id });
        if (present) {
          res.status(200).json(present);
        } else {
          res.status(400).json({ message: `login to access profile` });
        }
    } catch (err) {
      res.status(400).json({ "error occurred": err });
    }
  };


module.exports = {employeeProfile};
