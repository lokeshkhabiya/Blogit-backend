const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const CommentController = require("../controllers/comment/comment.controller");

const router = express.Router();

router.post("/addAComment", isAuthenticated, CommentController.addAComment);
router.get("/getAllComments", isAuthenticated, CommentController.getAllComments);

module.exports = router; 
