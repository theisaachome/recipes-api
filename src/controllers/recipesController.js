const asyncHandler = require("../middlewares/async");
const Recipe = require("../models/Recipe");
const ErrorResponse = require("../utils/errorResponse");

exports.getRecipes = asyncHandler(async (req, res, next) => {
 
        const recipes = await Recipe.find();
        res.status(200).json({
            sucess: true,
            total:recipes.length,
            data: recipes,
        })
    
})
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
        const recipe = await Recipe.findByIdAndUpdate(id,
            req.body,
            {
                new: true,
                runValidators: true
            });
        if (!recipe) {
           return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`,404));
        }

        res.status(200).json({
            sucess: true,
            data: recipe,
        });
})
exports.deleteRecipes = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`,404));
    }
    res.status(202).json({ sucess: true });
})