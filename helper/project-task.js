const mongoose = require('mongoose');

const projectTaskSchema = mongoose.Schema({
    projectId: { type: String },
    projectName: { type: String },
    taskId:{type:Number},
    taskName:{type:String},
    createdBy:{type:String},
    createdByName: { type: String },
    createdAt: { type: Date },
});

projectTaskSchema.pre('save', async function(){
    const task = await this.constructor.find();
    this.taskId = task.length+100001;
  });

const projectTaskModel = mongoose.model('projecttasks',projectTaskSchema);

module.exports = {projectTaskModel};