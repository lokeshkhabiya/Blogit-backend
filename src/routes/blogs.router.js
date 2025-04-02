const express = require("express");
const BlogController = require("../controllers/blog/blog.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const router = express.Router();

// - get ( single blog ) 
router.get("/getBlog", isAuthenticated, BlogController.getBlog)
// - get ( blog in bulk ) -> pagination 
// - get ( comments on a blog )
// - post ( create a blog )
router.post("/publish", isAuthenticated, BlogController.publishBlog);
// - post ( edit a blog ) -> user's blogs
// - post ( delete a blog ) -> user's blogs 
// - post ( like a blog ) -> add user 
router.post("/likeUnlikeBlog", isAuthenticated, BlogController.likeUnlikeBlog);

module.exports = router;