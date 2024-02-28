const { projectTaskModel } = require("../../helper/project-task");
const { taskModel } = require("../../helper/task-schema");

const createTask = async (req, res) => {

  try {
    if(req.user.role=='user'){
    const task = await projectTaskModel.findOne({_id: req.body.taskId,projectId:req.body.projectId}) 
    if (task) {
      req.body.employeeId = req.user.id;
      req.body.employeeName = req.user.employeeName;
      req.body.projectName = task.projectName;
      req.body.taskName = task.taskName;
      req.body.createdBy = req.user.id,
      req.body.createdByName = req.user.employeeName,
      req.body.createdAt = new Date();
      
      const taskDate = new Date(req.body.taskDate);
      
      let today = new Date();
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate()-1);
      

      if(taskDate.getDate()===yesterday.getDate() || taskDate.getDate()===today.getDate()){
        let result = await taskModel.create(req.body);  
        res.status(200).json({ message: `Added to task`,result });
      }else{
        res.status(400).json({ message: "Only yesterday or today's task you are allowed to Add" });
      }
        
    } else {
      res.status(400).json({ message: "Project/Task not found" });
    }
  } else {
    res.status(400).json({ message: "Access denied" });
  }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateWork = async (req, res) => {
  
  try {
    if(req.user.role=='user'){
    const task = await taskModel.findOne({ _id: req.params.taskId,employeeId:req.user.id });
    
    if (task) {
      const todaysDate = new Date().toString();
      const taskDate = task.createdAt.toString();
      
      if (todaysDate.substring(0,15) == taskDate.substring(0,15)) {
        const response = await taskModel.updateOne(
          {
            _id:req.params.taskId
          },
          { $set:  req.body}
        );
        if (response.acknowledged) {
          res.status(200).json({ message: "Task  updated succefully","task":req.body });
        } else {
          res.status(400).json({ message: "Task  not updated" });
        }
      } else {
        res.status(400).json({ message: "Can't modify on previous day task" });
      }
    } else {
      res.status(400).json({ message: "Task not found" });
    }
  } else {
    res.status(400).json({ message: "Access denied" });
  }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTaskOnDate = async (req, res) => {
  const search  = req.query.date+"";  
  const searchDate = new Date(search).toString();
  console.log("searchDate = ",searchDate);

  try {
    const task = await taskModel.find();
    const filtered = task.filter((data)=>{
      const employeeDate = data.createdAt.toString();
console.log("employeeDate",employeeDate);
      if (searchDate.substring(0,15) == employeeDate.substring(0,15)) {
        return data;
      }
    });
    
    if (filtered) {
      res.status(200).json(filtered);
    } else {
      res.status(400).json({ message: `Task not found ${searchDate}` });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

const employeeTask = async (req, res) => {
  try {
    if(req.query.filter){
      console.log(req.query.filter);

      const queryString = req.query.filter;
        
        const params = new URLSearchParams(queryString);

        const queryParamsObject = {};
        for (const [key, value] of params) {
          queryParamsObject[key] = value;
        }
        
        console.log(queryParamsObject);
  
      const task = await taskModel.find(queryParamsObject);
      res.status(200).json(task);
    }else if(req.query.search){
      const searchItem = req.query.search;
      const task = await taskModel.find({employeeId:req.user.id});
      const updates = task.filter((data)=>{
        const name = data.employeeName.toLowerCase();
        const project = data.projectName.toLowerCase();
        const taskName = data.taskName.toLowerCase();
        const tag = data.tagName.toLowerCase();
        const status = data.status.toLowerCase();

        console.log(name.includes(searchItem));
        if(name.includes(searchItem) || project.includes(searchItem) || taskName.includes(searchItem) || tag.includes(searchItem) || status.includes(searchItem) ){
          console.log(data);
          return data;
        }
      })
      res.status(200).json(updates);
    }else {
      const task = await taskModel.find({employeeId:req.user.id});
      res.status(200).json(task);
      
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const allTask = async (req, res) => {
  try {
    if(req.user.role=="admin"){
      if(req.query.filter){
        console.log(req.query.filter);
  
        const queryString = req.query.filter;
          
          const params = new URLSearchParams(queryString);
  
          const queryParamsObject = {};
          for (const [key, value] of params) {
            queryParamsObject[key] = value;
          }
          
          console.log(queryParamsObject);
    
        const projectTasks = await taskModel.find(queryParamsObject);
        res.status(200).json(projectTasks);
      }else if(req.query.search){
        const searchItem = req.query.search;
        const tasks = await taskModel.find();
        const updates = tasks.filter((data)=>{
         console.log("searching", searchItem);
          const name = data.employeeName.toLowerCase();
          const projectName = data.projectName.toLowerCase();
          const taskName = data.taskName.toLowerCase();
          const tagName = data.tagName.toLowerCase();

          if( name.includes(searchItem) || projectName.includes(searchItem) || taskName.includes(searchItem) || tagName.includes(searchItem)  ){
            console.log(data);
            return data;
          }
        })
        res.status(200).json(updates);
      }else if(req.query.date){
        const search  = req.query.date+"";  
        const searchDate = new Date(search).toString();

        const tasks = await taskModel.find();
      const filtered = tasks.filter((data)=>{
      const tasksDate = data.createdAt.toString();
      console.log("employeeDate",tasksDate);
      if (searchDate.substring(0,15) == tasksDate.substring(0,15)) {
        return data;
      }
    });
    
    if (filtered) {
      res.status(200).json(filtered);
    } else {
      res.status(400).json({ message: `Project not found on ${searchDate}` });
    }


      }else{
    const task = await taskModel.find();
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(400).json({ message: "You are not created any task" });
    }
  }
  } else {
    res.status(400).json({ message: "Access denied" });
  }
  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveTask = async (req, res) => {
  const { status } = req.body;
  
  try {
    if (req.user.role == "admin") {
      const task = await taskModel.findOne({ _id: req.params.taskId });
      if (task) {
        if(task.status!=status){
        const response = await taskModel.updateOne(
          { _id: req.params.taskId },
          { $set: { status: status,approvedBy:req.user.id,
          approver:req.user.employeeName }},
          { runValidators: true } 
        );
        if (response.acknowledged) {
          res.status(200).json({ message: `Task  ${status} succefully` });
        } else {
          res.status(400).json({ message: "Task  not updated" });
        }
      }else{
        res.status(400).json({ message: "status already updated" });
        }
      } else {
        res.status(400).json({ message: "Task not found" });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const employeeSingleTask = async (req, res) => {
  try {
    const task = await taskModel.findOne({_id:req.params.id});
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(400).json({ message: "Task doesn't exists" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
};

module.exports = { createTask, updateWork, getTaskOnDate, approveTask,employeeTask ,allTask,employeeSingleTask};
