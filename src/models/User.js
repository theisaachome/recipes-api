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
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
});

// Sign in with JWT
UserSchema.methods.getSignJwtToken=function(){
  return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRE
  });
}

const User = mongoose.model("User",UserSchema);
module.exports=User;