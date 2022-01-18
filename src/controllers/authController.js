const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.Register=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role} = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    // create token
    const token = user.getSignJwtToken();
   res.status(200).json({success:true,token});
})

exports.Signin=asyncHandler(async(req,res,next)=>{})

exports.ResetPassword=asyncHandler(async(req,res,next)=>{})