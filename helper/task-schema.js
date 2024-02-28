const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    employeeId: { type: String},
    employeeName: { type: String },
    projectId: { type: String },
    projectName: { type: String },
    taskId: { type: String },
    taskName: { type: String },
    tagName: { type: String },
    description: { type: String },
    createdBy:{type:String},
    createdByName: { type: String },
    taskDate :{ type: Date },
    createdAt: { type: Date },
    status:{type:String,enum:["approved","rejected",""],default:""},
    approvedBy:{ type: String ,default:""},
    approver:{ type: String,default:"" }
  });
  
  const taskModel = mongoose.model('employeetask',taskSchema);

  module.exports = {taskModel};