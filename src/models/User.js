const crypto = require('crypto');
const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name"]
    },
    email:{
        type:String,
        required:[true,"Please add an email"],
        unique:true,

    },
    role:{
        type:String,
        enum:["user",'admin'],
        default:'user',
    },
    password:{
        type:String,
        required:[true,"Please password"],
        minlength:6,
        select:false,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
},{timestamps:true});

// bcrypt user password
UserSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
});

// Sign JWT and return
UserSchema.methods.getSignJwtToken=function(){
  return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRE
  });
}
// Match user entered password and bcrypted password
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// generate token and hash password token
UserSchema.methods.getResetPasswordToken=function(){
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash token and set to resetPasswordToken field.
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    // set expire for passwordResettoken
    this.resetPasswordExpire =  Date.now() +  5 *60*1000;
    return resetToken;
}
const User = mongoose.model("User",UserSchema);
module.exports=User;