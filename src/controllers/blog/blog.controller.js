const BlockNoteEditor = require("@blocknote/server-util");
const BlogModel = require("../../models/Blog.model");
const { v4: uuidv4 } = require("uuid");
const userModel = require("../../models/User.model");

const publishBlog = async (req, res) => {
    try {
        const user = req.user;
        const { title, description, category, content } = req.body;

        if (!title || !description || !category || !content) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
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
            published_on: new Date().toLocaleDateString(),
            category: category,
        });

        const addBlogIdToUser = await userModel.findOneAndUpdate(
            { user_id: user.user_id },
            { $push: { blogs: blogId } },
            { new: true, runValidators: true }
        );

        return res.status(201).json({
            success: true,
            message: "New blog published successfully!",
            blog_id: blogId,
        });
    } catch (error) {
        console.error("Error while publishing blog!!", error);
        return res.status(500).json({
            success: false,
            message: "Error while publishing blog",
            error: error.message,
        });
    }
};

const getBlog = async (req, res) => {
    try {
        const { blog_id } = req.query;
        const user = req.user; 

        const blog = await BlogModel.findOne({ blog_id });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        let isLiked = false;
        if (blog.likes.some(like => like.user_id === user.user_id)) {
            isLiked = true;
        }

        const author = await userModel.findOne({ user_id: blog.user_id });

        const editor = BlockNoteEditor.ServerBlockNoteEditor.create();
        const blocks = JSON.parse(blog.content[0]);
        const htmlContent = await editor.blocksToFullHTML(blocks);

        return res.status(200).json({
            success: true,
            data: {
                title: blog.title,
                description: blog.description,
                category: blog.category,
                author: author,
                author_pic: author.profile_pic,
                published_on: blog.published_on,
                isLiked: isLiked,
                likes_count: blog.likes_count,
                comments_count: blog.comments_count,
                htmlContent: htmlContent,
            },
        });
    } catch (error) {
        console.error("Error while getting blog:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting blog",
            error: error.message,
        });
    }
};

const likeUnlikeBlog = async (req, res) => {
    try {
        const { blog_id } = req.body;
        const { user_id } = req.user; 

        // check if user is in the blog likes
        const blog = await BlogModel.findOne(
            { blog_id: blog_id }
        )

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        if (blog.likes.some(like => like.user_id === user_id)) {
            blog.likes = blog.likes.filter(like => like.user_id !== user_id);
            blog.likes_count -= 1;
            await blog.save();
            
            return res.status(200).json({
                success: true,
                message: "Blog unliked successfully",
                likes_count: blog.likes_count
            });
        }

        blog.likes.push({ user_id });
        blog.likes_count += 1;
        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            likes_count: blog.likes_count
        });

        
    } catch (error) {
        console.error("Error while liking blog:", error);
        return res.status(500).json({
            success: false,
            message: "Error while liking blog",
            error: error.message,
        });
    }
};

const BlogController = {
    publishBlog,
    getBlog,
    likeUnlikeBlog,
};

module.exports = BlogController;
