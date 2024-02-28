const express =  require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const PORT = 5050;
const { mongoDbServer } = require('./config/configuration');
const cors =require('cors');

const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });
app.use(express.json()); 
bodyParser.json()
app.use(bodyParser.urlencoded({extended:false}));
dotenv.config(); 


const server = app.listen(PORT,()=>{
    console.log('Listening on server http://localhost:',PORT);
});

process.on("unhandledRejection", err=>{
    console.log(`An error occurred : ${err.message}`);
    server.close(()=>process.exit(1));
})


 

mongoDbServer();

const employeeRouter = require('./routers/employee-router');
const adminRouter = require('./routers/admin-router');
const projectRouter = require('./routers/project-router');

app.use('/e1',employeeRouter);
app.use('/a1',adminRouter);
app.use('/p1',projectRouter);