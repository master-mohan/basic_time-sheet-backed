const { projectModel } = require("../../helper/project-schema");

const createProject = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const project = await projectModel.findOne({
        projectName: req.body.projectName,
      });
      if (!project) {
        req.body.createdBy = req.user.id;
        req.body.createdByName = req.user.employeeName;
        req.body.createdAt = new Date();
        await projectModel.create(req.body);
          res.status(200).json({
            message: `${req.body.projectName} Project saved successfully`,
          });
      } else {
        res
          .status(400)
          .json({ message: `${req.body.projectName} Project already exists` });
      }
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};


//All Project list
const listProject = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      
      if(req.query.filter){
        console.log(req.query.filter);
  
        const queryString = req.query.filter;
          
          const params = new URLSearchParams(queryString);
  
          const queryParamsObject = {};
          for (const [key, value] of params) {
            queryParamsObject[key] = value;
          }
          
          console.log(queryParamsObject);
    
        const projectTasks = await projectModel.find(queryParamsObject);
        res.status(200).json(projectTasks);
      }else if(req.query.search){
        const searchItem = req.query.search;
        const projects = await projectModel.find();
        const updates = projects.filter((data)=>{
         
          const projectName = data.projectName.toLowerCase();
          const createdBy = data.createdByName.toLowerCase();
         
          if( projectName.includes(searchItem) || createdBy.includes(searchItem)  ){
            console.log(data);
            return data;
          }
        })
        res.status(200).json(updates);
      }else if(req.query.date){
        const search  = req.query.date+"";  
        const searchDate = new Date(search).toString();

        const projects = await projectModel.find();
    const filtered = projects.filter((data)=>{
      const projectDate = data.createdAt.toString();
      console.log("employeeDate",projectDate);
      if (searchDate.substring(0,15) == projectDate.substring(0,15)) {
        return data;
      }
    });
    
    if (filtered) {
      res.status(200).json(filtered);
    } else {
      res.status(400).json({ message: `Project not found on ${searchDate}` });
    }


      }else{
        const project = await projectModel.find();
        
        if(project){
          res.status(200).json(project);
        }else{
          res.status(400).json({"message":"No projects available"});
        }
      }
     
    } else {
      res.status(400).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(400).json({ "error occurred": error });
  }

};

const updateStatus = async (req,res) =>{
  const {projectName,status} = req.body;
  try {
    const check = await projectModel.findOne({_id:req.params.id});
    if(check.status==status){
      res.status(400).json({"message":`status already updated to ${status}`});
    }else{
    if (req.user.role == "admin") {
    const project = await projectModel.updateOne({_id:req.params.id},{$set:{status:status}},{ runValidators: true });
    if(project.acknowledged){
          res.status(200).json({ message: `Status updated "${status}" to the project "${projectName}" Succefully` });
    }else{
      res.status(400).json({"message":"unable to update status"});
    }
  } else {
    res.status(400).json({ message: "Access denied" });
  }
  }
  } catch (error) {
    res.status(400).json({ "error occurred": error });
  }
}

module.exports = { createProject, listProject,updateStatus };
