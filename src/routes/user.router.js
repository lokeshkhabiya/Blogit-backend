const express = require("express");
const userController = require("../controllers/user/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const router = express.Router(); 

router.post("/updateDetails", isAuthenticated, userController.updateDetails);

module.exports = router; 