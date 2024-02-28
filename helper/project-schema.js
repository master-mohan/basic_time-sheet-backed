const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  projectId: { type: Number },
  projectName: { type: String },
  status: { type: String,enum:['active','inactive'],default:'active'},
  createdBy:{type:String},
  createdByName: { type: String },
  createdAt: { type: Date }
});

projectSchema.pre('save', async function(){
  const allProject = await this.constructor.find();
  this.projectId = allProject.length+1000;
});

const projectModel = mongoose.model('projects', projectSchema);

module.exports = {projectModel};