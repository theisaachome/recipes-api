
const express = require('express');
const { 
    getRecipes,
    getRecipe, 
    createRecipes, 
    updateRecipes, 
    deleteRecipes } = require('../controllers/recipesController');
const router = express.Router();
router.route('/')
    .get(getRecipes)
    .post(createRecipes);
router.route('/:id')
    .get(getRecipe)
    .put(updateRecipes)
    .delete(deleteRecipes);

module.exports = router;