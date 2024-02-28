const express = require('express');
const router = express.Router();
const {employeeLogin} = require('../controllers/common-controller/employee-login.controller');
const { createTask, updateWork,getTaskOnDate,approveTask, employeeTask,allTask,employeeSingleTask } = require('../controllers/employee/task-crud.controller');
const { userAuth } = require('../middlewares/authMiddleware');
const { employeeProfile } = require('../controllers/employee/employee-profile');


router.post('/employee/login',employeeLogin);

router.post('/employee/task/create',userAuth,createTask);

router.put('/employee/task/update/:taskId',userAuth, updateWork );

router.get('/employee/task/getondate', getTaskOnDate );

router.put('/employee/task/aprove/:taskId',userAuth, approveTask );

router.get("/user/employee/profile", userAuth, employeeProfile);

router.get("/user/employee/employeetask", userAuth, employeeTask);

router.get("/user/employee/alltask", userAuth, allTask);
 
router.get("/user/employee/singletask/:id", userAuth, employeeSingleTask);

module.exports = router;