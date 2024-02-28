const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const validateEmployeeSchema = mongoose.Schema({
  employeeId: { type: Number, unique: true },
  employeeName: { type: String },
  email: { type: String, unique: true },
  phoneNo: { type: Number, unique: true },
  age: { type: Number },
  dob: { type: Date },
  address: { type: String },
  governmentId: { type: Number, unique: true },
  pan: { type: String, unique: true },
  designation: { type: String },
  role: { type: String, enum: ["user", "admin"] },
  password: { type: String},
  isDelete: { type: Boolean, default:false},
  isActive: { type: Boolean, default:true},
  createdBy:{type:String},
  createdByName: { type: String },
  createdAt: { type: Date },
  jwtToken:{type:String}
});

validateEmployeeSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password,salt);
    const employees = await this.constructor.find();
    console.log(employees);
    this.employeeId = employees.length+10001;
})

 
const employeeSchema = mongoose.model("employees", validateEmployeeSchema);

module.exports = { employeeSchema,validateEmployeeSchema };




























//  employeeSchema.create({
//   employeeId: 1,
//   employeeName: "Mohan",
//   email: "mohan@mail.com",
//   phoneNo: 6784567856,
//   age: 24,
//   dob: '1999-08-22',
//   address: 'Mysore',
//   governmentId: 345678345678,
//   pan: 'H7DF43FD4R',
//   designation: 'Software Engineer',
//   role: 'admin',
//   password: 'mohan@123',
//   isDelete: false,
//   isActive: true,
//   createdBy: 'Admin',
//   createdAt: '2023-08-12'
// });

// let check = async()=>{
// var response = await employeeSchema.updateOne({employee_id:2},
//     {
//         $push: {
//             'task': {
//                 project_id:2,
//                 project_name:'Second Project',
//                 task_id:2,
//                 task_name:'Second Task',
//                 tag_name:'first',
//                 description:'working project',
//                 date:'2023-08-12'
//             }
//         }
//     }
// );
//     console.log(response);
//         }
// check();

