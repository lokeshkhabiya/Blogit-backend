const Blogs = require("../../models/Blog.model");
const { v4: uuidv4 } = require("uuid");
const userModel = require("../../models/User.model");
const CommentModel = require("../../models/Comment.model");

const addAComment = async (req, res) => {
    try {
        const { blog_id, comment, timeStamp } = req.body; 
        const { user_id } = req.user; 

        const blog = await Blogs.findOne({ blog_id });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const comment_id = uuidv4(); 

        // Create new comment
        const newComment = await CommentModel.create({
            comment_id,
            blog_id,
            user_id,
            content: comment,
            created_at: timeStamp
        });

        await newComment.save();

        blog.comments_count += 1;
        await blog.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });


    } catch (error) {
        console.error("Error while adding comment on blog:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding comment on blog",
            error: error.message,
        });
    }
}

const getAllComments = async (req, res) => {
    try {
        const { blog_id } = req.query;

        const comments = await CommentModel.find({ blog_id })
            .sort({ created_at: -1 });
        
        const commentsWithUserDetails = await Promise.all(comments.map(async (comment) => {
            const user = await userModel.findOne({ user_id: comment.user_id });
            return {
                full_name: user?.full_name || '',
                profile_pic: user?.profile_pic || '',
                timestamp: comment.created_at,
                content: comment.content
            };
        }));

        return res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comments: commentsWithUserDetails
        });
        
    } catch (error) {
        console.error("Error while getting all blog:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting all blog",
            error: error.message,
        });
    }
}

const CommentController = {
    addAComment,
    getAllComments
}

module.exports = CommentController