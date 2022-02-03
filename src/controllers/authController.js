const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    //     // create token
    //     const token = user.getSignJwtToken();
    //    res.status(200).json({success:true,token});
    sendTokenResponse(user, 200, res);
})

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for a User at database.
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse('Invalid Credential.', 401));
    }
    //  check if pwd match 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid Credential.', 401));
    }
    // create token
    //     const token = user.getSignJwtToken();
    //    res.status(200).json({success:true,token});
    sendTokenResponse(user, 200, res);
})
//  Current loggedin User
exports.getMe=asyncHandler(async(req,res,next)=>{
    const user =await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user,
    })
});

// forget Password
exports.forgotPassword =asyncHandler(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorResponse(`There is no user with that email`,404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        data:user,
    })
});
exports.resetPassword = asyncHandler(async (req, res, next) => { })



//  Get token from model , create cookie and send response.
const sendTokenResponse = (user, statusCoode, res) => {

    // create token
    const token = user.getSignJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    if(process.env.NODE_ENV==="production"){
        options.secure=true;
    }

    res
        .status(statusCoode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });

}