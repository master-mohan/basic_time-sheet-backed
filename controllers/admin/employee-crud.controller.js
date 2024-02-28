const { employeeSchema } = require("../../helper/employee-schema");
const validatingEmployeeShema = require("../../helper/validate-schema");

//add the employee detail to database
const createEmployee = async (req, res) => {
  const { employeeName } = req.body;
  try {
    if (req.user.role == "admin") {
      const isPresent = await employeeSchema.findOne({
        phoneNo: req.body.phoneNo,
      });
      if (!isPresent) {
        const { error } = await validatingEmployeeShema.validate(req.body);
        if (!error) {
          req.body.createdBy = req.user.id;
          req.body.createdByName = req.user.employeeName;
          req.body.createdAt = new Date();
          const result = await employeeSchema.create(req.body);
          res.status(200).json({
            message: `${employeeName} employee saved successfully`,
            result,
          });
        } else {
          res.status(400).json({ message: error.details[0].message });
        }
      } else {
        res
          .status(200)
          .json({ message: `${employeeName} Employeee already exists` });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(400).json({"message":`${JSON.stringify(error.keyValue)} not allowed`});
  }
};

//All Employee list
const listEmployee = async (req, res) => {
  try {
    if (req.user.role == "admin") {   
      console.log("List : ", req.user);
      console.log(req.query.search);
      if(req.query.search){
        const search = req.query.search;
        const employee = await employeeSchema.find({isDelete:false,isActive:true});
        const updates = employee.filter((data) => {
          const name = data.employeeName.toLowerCase();
          const phone = data.phoneNo + "";
          const designation = data.designation.toLowerCase();
          const role = data.role.toLowerCase();
          
         console.log("DB==",name,"Search ==",search);
          if (
            name.includes(search) ||
            phone.includes(search) ||
            designation.includes(search) ||
            role.includes(search)
          ) {
            return data;
          }
        });
        console.log(updates);
        res.status(200).json(updates);
      }
      else if(req.query.filter){
        console.log(req.query.filter);

        const queryString = req.query.filter;
          
          const params = new URLSearchParams(queryString);

          const queryParamsObject = {};
          for (const [key, value] of params) {
            queryParamsObject[key] = value;
          }
          queryParamsObject.isDelete=false;
          queryParamsObject.isActive=true;

          console.log(queryParamsObject);
    
        const employee = await employeeSchema.find(queryParamsObject);
        res.status(200).json(employee);
      }else{
        const employee = await employeeSchema.find({isDelete:false,isActive:true});
        res.status(200).json(employee);
      }
     
    } else { 
      res.status(400).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(400).json({ "error occurred": error });
  }
};

//Update the emp details with new set of value
let updateEmployee = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      console.log(req.params.id);
      const present = await employeeSchema.findOne({ _id: req.params.id });
      if (present) {
        await employeeSchema.updateOne(
          { _id: req.params.id },
          { $set: req.body }
        );
        res.status(200).json({
          message: `employee Updated`,
          updated: req.body,
        });
      } else {
        res.status(400).json({ message: `employee not found` });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

//change the employee delete status
let deleteEmployee = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const emp = await employeeSchema.findOne({ _id: req.params.id });
      if (!emp.isDelete) {
        await employeeSchema.updateOne(
          { _id: req.params.id },
          { $set: { isDelete: true, isActive: false } }
        );
        res
          .status(200)
          .json({ message: `${emp.employeeName} Employee deleted` });
      } else {
        res.status(400).json({ message: "Employee not deleted" });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//display the requested employee details
let viewEmployee = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const present = await employeeSchema.find({ _id: req.params.id });
      if (present) {
        res.status(200).json(present);
      } else {
        res.status(400).json({ message: `Employee not found` });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(400).json({ "error occurred": err });
  }
};

const onSearch = async(req,res)=>{
  const search = req.body.search;
  console.log(search);
  try {
    if (req.user.role == "admin") {
      const present = await employeeSchema.find();

      if (present) {   
       const updates =  present.filter((data)=>{
          const name = data.employeeName;
          const phone = data.phoneNo.toString();
          const designation = data.designation;

          if(name.includes(search) || phone.includes(search) || designation.includes(search)){
            console.log(search);
            console.log(name.includes(search));
            console.log(phone+"".includes(search)); 

            return data;
          }      
        })
        if(updates){  
          res.status(200).json(updates);
        }
        
      } else {
        res.status(400).json({ message: `Employee not found` });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(400).json({ "error occurred": err });
  }
}
  
// let onDate = async (req, res) => {
//   try {
//     if (req.user.role == "admin") {
//       const getData = await employeeSchema.find();
//       const present = getData.filter((data)=>{
//         const employeeDate = data.date.substring(0,10);
//         const searchDate = req.body.date;

//         console.log(employeeDate,"  ==  ",searchDate);
//       })
//       if(present) {
//         res.status(200).json(present);
//       } else {
//         res.status(400).json({ message: `Employee not found` });
//       }
//     } else {
//       res.status(400).json({ message: "Access denied" });
//     }
//   } catch (err) {
//     res.status(400).json({ "error occurred": err });
//   }
// };

module.exports = {
  createEmployee, 
  listEmployee,
  updateEmployee,
  deleteEmployee,
  viewEmployee,
  onSearch,
};
