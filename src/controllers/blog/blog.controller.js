const BlogModel = require("../../models/Blog.model");
const Blogs = require("../../models/Blog.model");
const { v4: uuidv4 } = require("uuid");
const userModel = require("../../models/User.model");

const publishBlog = async (req, res) => {
    try {   
        const user = req.user; 
        const { title, description, category, content } = req.body;

        if (!title || !description || !category || !content) {
            return res.status(400).json({
                success: false, 
                message: "All fields are required!"
            });
        }

        const blogId = uuidv4();

        const newBlog = await BlogModel.create({
            blog_id: blogId,
            user_id: user.user_id,
            title: title,
            description: description,
            content: content,
            publish: true, 
            category: category
        });

        const addBlogIdToUser = await userModel.findOneAndUpdate(
            { user_id: user.user_id },
            { $push: { blogs: blogId } },
            { new: true, runValidators: true }
        );

        return res.status(201).json({
            success: true, 
            message: "New blog published successfully!",
            blog_id: blogId
        });
    } catch (error) {
        console.error("Error while publishing blog!!", error);
        return res.status(500).json({
            success: false,
            message: "Error while publishing blog",
            error: error.message
        });
    }
}

const BlogController = {
    publishBlog
}

module.exports = BlogController;