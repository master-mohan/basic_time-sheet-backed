const mongoose = require('mongoose')

const mongoDbServer = ()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/timesheet')
    .then(()=>console.log('connected to MongoDB Database'))
    .catch((err)=>console.log("Database connection failed"));
}

module.exports = {mongoDbServer};
