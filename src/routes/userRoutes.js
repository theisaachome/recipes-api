const express = require("express");
const { getUserByname, getUserRecipes } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.get('/recipes',protect,getUserRecipes);


module.exports = router;