const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment_id: {
        type: String, 
        required: true,
        unique: true
    }, 
    blog_id: {
        type: String, 
        required: true,
        ref: 'Blogs'
    },
    user_id: {
        type: String, 
        required: true,
        ref: 'Users'
    },
    content: {
        type: String, 
        required: true,
        trim: true,
        maxLength: 1000
    }, 
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Update the updated_at timestamp before saving
commentSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

const CommentModel = mongoose.model("Comments", commentSchema);
module.exports = CommentModel;