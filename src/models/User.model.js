const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: {
        type: String, 
        required: true,
        unique: true
    }, 
    googleId: {
        type: String,
        sparse: true,
        index: {
            unique: true,
            sparse: true,
            partialFilterExpression: { googleId: { $type: "string" } }
        }
    },
    full_name: {
        type: String, 
        required: true 
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password only required if not using Google auth
        }
    },
    bio: {
        type: String,
        default: "" 
    },
    profile_pic: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    blogs: [{
        type: String,
        required: true
    }]
})

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;