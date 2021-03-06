const express = require('express');
const cookieParser  = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/error');

// Load env variables.
dotenv.config({path:"./config/config.env"});
connectDB();

// Routes file import 
const recipes = require('./src/routes/recipesRoutes');
const auth= require('./src/routes/authRoutes');
const user = require('./src/routes/userRoutes');

const app = express();

//  Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());



//  Development logging
// app.use(logger)
if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'))
}

// Mount All the routes file
app.use("/api/v1/recipes",recipes);
app.use('/api/v1/auth',auth);
app.use("/api/v1/users",user);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server=app.listen(
    PORT,
    ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}.`.green.bold);
})

// Handle unhandle rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error : ${err.message}`.red.bold);
    // Close server and exit process
    server.close(()=>process.exit(1));
})