const mongoose = require('mongoose');
const slugify = require('slugify');


const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name."],
        trim: true,
    },
    typeOfMeat:{
        type:String,
        required:[true,"Please add the type of meat for recipe."]
    },
    images: [],
    slug: String,
    description: {
        type: String,
        required: [true, "Please add description for the recipe."],
        trim: true,
        maxlength: [500, 'Name can not be more thann 50 characters long.']
    },
    serve: {
        type: Number,
    },
    preTime: {
        type: String,
    },
    cookTime: {
        type: String,
    },
    ingredients: {
        type: [String],
        required: [true, "Please add all the ingredients for recipe."],
    },
    instructions: {
        type: [String],
        required: [true, "Please add all the instructions for recipe."],
    },
    tags: [],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
//  Create Recipe Slugify
recipeSchema.pre('save', function (next) {
    console.log("Slugify runinng", this.name);
    next();
})


module.exports = mongoose.model('Recipe', recipeSchema);