
const express = require('express');
const {protect, authorize} = require('../middlewares/auth');

const { 
    getRecipes,
    getUserRecipes,
    getRecipe, 
    createRecipes, 
    updateRecipes, 
    deleteRecipes } = require('../controllers/recipesController');
const router = express.Router();

router.route('/')
    .get(getRecipes)
    .post(protect,createRecipes);



router.route('/:id')
    .get(getRecipe)
    .put(protect,updateRecipes)
    .delete(protect,authorize('user'),deleteRecipes);


module.exports = router;