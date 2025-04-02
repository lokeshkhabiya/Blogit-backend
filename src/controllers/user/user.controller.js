const User = require("../../models/User.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUsingEmail = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        const newUser = await User.create({
            user_id: uuidv4(),
            full_name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const signinUsingEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { 
                _id: user._id,
                userId: user.user_id,
                full_name: user.full_name,
                email: user.email,
                bio: user.bio || "",
                profile_pic: user.profile_pic || ""
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: "Signin successful", 
            token,
            user: user
        });

    } catch (error) {
        console.error("Error while signin: ", error);
        return res.status(500).json({
            success: false, 
            message: "Internal server error"
        })
    }
}

const updateDetails = async (req, res) => {
    try {
        const { full_name, bio } = req.body;
        const { user_id } = req.user;

        const updatedUser = await User.findOneAndUpdate(
            { user_id },
            { full_name, bio },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
            user: {
                _id: updatedUser._id,
                user_id: updatedUser.user_id,
                full_name: updatedUser.full_name,
                email: updatedUser.email,
                bio: updatedUser.bio || "",
                profile_pic: updatedUser.profile_pic || ""
            }
        });
        
    } catch (error) {
        console.error("Error while updating user data: ", error);
        return res.status(500).json({
            success: false, 
            message: "Internal server error"
        })
    }
}

const userController = {
    signupUsingEmail,
    signinUsingEmail,
    updateDetails
}

module.exports = userController;