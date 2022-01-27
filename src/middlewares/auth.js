const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require('../models/User');
const ErrorResponse = require("../utils/errorResponse");
const res = require("express/lib/response");


// protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Make sure cookie exists
    if (!token) {
        return next(new ErrorResponse('Not Authorize to access this route.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return next(new ErrorResponse('Not Authorize to access this route.', 401));
    }
    req.user = await User.findById(decoded.id);
    next();
});


// grant access to specific roles
exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this resources.`, 403));
        }
        next();
    }

}