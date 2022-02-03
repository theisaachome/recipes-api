const crypto = require('crypto');
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendMail");


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
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    })
});

// forget Password
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });
        res.status(200).json({
            success: true,
            data: "Email Sent"
        })
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //get hashed token 
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorResponse(`Invalid Token`));
    };
    //set new password

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
});


//  Current loggedin User
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const filedsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    }
    const user = await User.findByIdAndUpdate(req.user.id,
        filedsToUpdate, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    })
});




//  Current loggedin User
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if(!user.matchPassword(req.body.currentPassword)){
        return next(new ErrorResponse('Password is incorrect.',401));
    }
    user.password=req.body.newPassword;
    await user.save();
    sendTokenResponse(user,200,res);
});

//  Get token from model , create cookie and send response.
const sendTokenResponse = (user, statusCoode, res) => {

    // create token
    const token = user.getSignJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res
        .status(statusCoode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });

}