const express = require("express");
const { Register } = require("../controllers/authController");

const router = express.Router();

router.post("/register",Register)

module.exports=router;