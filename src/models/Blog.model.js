const mongoose = require("mongoose");
const CATEGORY_TYPES = require("../utils/categoryTypes");

const blogSchema = new mongoose.Schema({
    blog_id: {
        type: String, 
        required: true, 
        unique: true
    }, 
    user_id: {
        type: String,
        required: true
    }, 
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    }, 
    content: {
        type: [{
            id: String,
            type: String,
            props: {
                textColor: String,
                backgroundColor: String,
                textAlignment: String,
                level: Number
            },
            content: [{
                type: String,
                text: String,
                styles: mongoose.Schema.Types.Mixed
            }],
            children: [mongoose.Schema.Types.Mixed]
        }],
        required: true
    },
    publish: {
        type: Boolean,
        default: false
    },
    published_on: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        enum: Object.values(CATEGORY_TYPES),
        required: true
    },
    cover_img: {
        type: String,
        // required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    likes: [{
        user_id: {
            type: String,
            required: true
        }
    }],
    likes_count: {
        type: Number,
        default: 0
    },
    comments_count: {
        type: Number,
        default: 0
    }
});

const BlogModel = mongoose.model("Blogs", blogSchema);
module.exports = BlogModel;