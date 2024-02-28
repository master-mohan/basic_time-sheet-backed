const { projectModel } = require("../../helper/project-schema");
const { projectTaskModel } = require("../../helper/project-task");

//add task to project
const addTaskToProject = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const project = await projectModel.findOne({
        _id: req.body.projectId,
      });
      if (project) {
        const task = await projectTaskModel.findOne({
          taskName: req.body.taskName,
        });
        if (!task) {
          req.body.projectName = project.projectName;
          req.body.createdBy = req.user.id;
          req.body.createdByName = req.user.employeeName;
          req.body.createdAt = new Date();
          await projectTaskModel.create(req.body);
          res
            .status(200)
            .json({ message: `${req.body.taskName} Task added successfully` });
        } else {
          res.status(400).json({ message: "Task already exist" });
        }
      } else {
        res.status(400).json({ message: "Project Not found" });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};


const viewProjecttasks = async(req,res)=>{

  try {
    const projectTasks = await projectTaskModel.find({projectId:req.params.id});
    if(projectTasks.length>=1){
      res
            .status(200)
            .json(projectTasks);
    }else{
      res.status(400).json({ message: "Tasks not created for this project" });
    } 
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

const viewSingleTask = async(req,res)=>{

  try {
    const projectTasks = await projectTaskModel.find({_id:req.params.id});
    if(projectTasks.length>=1){
      res
            .status(200)
            .json(projectTasks);
    }else{
      res.status(400).json({ message: "Tasks not found" });
    } 
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}


const allProjectTasks = async(req,res)=>{
  
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
  
      const projectTasks = await projectTaskModel.find(queryParamsObject);
      res.status(200).json(projectTasks);
    }else if(req.query.search){
      const searchItem = req.query.search;
      const projectTasks = await projectTaskModel.find();
      const updates = projectTasks.filter((data)=>{
       
        const project = data.projectName.toLowerCase();
        const taskName = data.taskName.toLowerCase();
       
        if( project.includes(searchItem) || taskName.includes(searchItem)  ){
          console.log(data);
          return data;
        }
      })
      res.status(200).json(updates);
    }else {
      const projectTasks = await projectTaskModel.find();

      if(projectTasks.length>=1){
      res
            .status(200)
            .json(projectTasks);
    }else{
      res.status(400).json({ message: "Tasks not created for this project" });
    }
  }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }

}

module.exports = { addTaskToProject,viewProjecttasks,viewSingleTask,allProjectTasks };
  