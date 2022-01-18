const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err,req,res,next)=>{
    let error = {...err};

    error.message = err.message;

    //log to console for development
    // console.log(err.stack.red);
    // console.log(err.name);
    console.log(err);

    //  Mongoose CastError
    if(err.name==="CastError"){
        const  message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message,404);
    }

    //  Mongoose duplicate key
    if(err.code === 11000){
        const  message = `Duplicate field values entered.`;
        error = new ErrorResponse(message,400);
    }

      //  Mongoose required fields.
      if(err.name === "ValidatorError"){
        const  message  = Object.values(err.values).map((val)=>val.message);
        error = new ErrorResponse(message,400);
    }
    res.status(error.statusCode||500).json({
        sucess:false,
        error:error.message||"Error occured.",
    });
}
module.exports  = errorHandler;