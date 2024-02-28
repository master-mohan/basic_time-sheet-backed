const express = require("express");
const router = express.Router();
const {
  createEmployee,
  listEmployee,
  updateEmployee,
  deleteEmployee,
  viewEmployee,
  onSearch,
} = require("../controllers/admin/employee-crud.controller");
const { userAuth } = require("../middlewares/authMiddleware");
   
 
//Check for user authentication and creates employee document
router.post("/admin/employee/create", userAuth, createEmployee);

//Check for user authentication and fetch the employee documents
router.get("/admin/employee/list", userAuth, listEmployee);

router.put("/admin/employee/update/:id", userAuth, updateEmployee);

router.delete("/admin/employee/delete/:id", userAuth, deleteEmployee);

router.get("/admin/employee/view/:id", userAuth, viewEmployee);

router.get("/admin/employee/search", userAuth, onSearch);


module.exports = router;
