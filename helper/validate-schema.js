const joi = require('joi');


const validatingEmployeeShema = joi.object({
    employeeName:joi.string().required(),
    email:joi.string().email().required(),
    phoneNo:joi.number().min(10).required(),
    age:joi.number().required(),
    dob:joi.date().required(),
    address:joi.string().required(),
    governmentId:joi.number().min(12).required(),
    pan:joi.string().length(10).required(),
    designation:joi.string().required(),
    role:joi.string().required(),
    password:joi.string().min(5).required(),
});

module.exports = validatingEmployeeShema;