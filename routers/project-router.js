const express = require("express");
const router = express.Router();
const { createProject,listProject,updateStatus} = require("../controllers/admin/project-crud.controller");
const { userAuth } = require("../middlewares/authMiddleware");
const { addTaskToProject,viewProjecttasks,viewSingleTask,allProjectTasks } = require("../controllers/admin/project-task.controller");

//To create task by admin
router.post("/admin/project/create",userAuth,createProject);

router.get("/admin/project/list",userAuth,listProject);

router.put("/admin/project/status/:id",userAuth,updateStatus);

router.post("/admin/project/tasktoproject",userAuth,addTaskToProject);

router.get("/admin/project/viewprojecttasks/:id",userAuth,viewProjecttasks);

router.get("/admin/project/allprojecttasks",userAuth,allProjectTasks);

router.get("/admin/project/viewsingletask/:id",userAuth,viewSingleTask);

module.exports = router; 