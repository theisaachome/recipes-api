const asyncHandler = require("../middlewares/async");
const Recipe = require("../models/Recipe");
const ErrorResponse = require("../utils/errorResponse");

exports.getRecipes = asyncHandler(async (req, res, next) => {
    console.log(req.user);
        const recipes = await Recipe.find();
        res.status(200).json({
            sucess: true,
            total:recipes.length,
            data: recipes,
        })
});



exports.getRecipe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`,404));
     }
    res.status(200).json({
        sucess: true,
        data: recipe
    })
});
exports.createRecipes = asyncHandler(async (req, res, next) => {
    req.body.user=req.user.id;
    const recipe = new Recipe(req.body);
    await recipe.save();
    if(!recipe){
        return next(new ErrorResponse('Something went wrong. Please try again',400));
    }
    res.status(201).json({
        sucess: true,
        data: recipe,
    });
})
exports.updateRecipes = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let recipe = await Recipe.findById(id);
        if (!recipe) {
           return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`,404));
        }

        // Make sure the user is the recipe owner.
        if(recipe.user.toString()!==req.user.id){
            return next(
                new ErrorResponse(`User have no right to access to operate on this action.`,401)
            );
        }
         recipe = await Recipe.findByIdAndUpdate(id,
            req.body,
            {
                new: true,
                runValidators: true
            });

        res.status(200).json({
            sucess: true,
            data: recipe,
        });
})
exports.deleteRecipes = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`,404));
    }
    if(recipe.user.toString()!==req.user.id){
        return next(
            new ErrorResponse(`User have no right to access to operate on this action.`,401)
        );
    }
    await recipe.remove();
    res.status(202).json({ sucess: true });
})