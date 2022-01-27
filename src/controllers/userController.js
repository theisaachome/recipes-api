const asyncHandler = require("../middlewares/async");
const Recipe = require("../models/Recipe");
const User = require("../models/User");


exports.getUserByname=asyncHandler(async(req,res,next)=>{
    const user = await  User.find({name:req.params});

    res.status(200).json(user);
})

exports.getUserRecipes = asyncHandler(async (req, res, next) => {
    const recipes = await Recipe.find({user:req.user.id});
    res.status(200).json({
        sucess: true,
        total:recipes.length,
        data: recipes,
    })
});