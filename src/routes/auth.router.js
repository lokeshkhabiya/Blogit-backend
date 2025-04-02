const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/user/user.controller");


const router = express.Router(); 

router.get("/google", passport.authenticate("google", { scope: ['profile', 'email']}));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "https://theblogit.vercel.app/signin" }), (req, res) => {
    // Generate JWT token for Google authenticated user
    const token = jwt.sign(
        {
            _id: req.user.id,
            userId: req.user.user_id,
            full_name: req.user.full_name,
            email: req.user.email,
            bio: req.user.bio || "",
            profile_pic: req.user.profile_pic || ""
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    // Redirect with token in query param
    res.redirect(`https://theblogit.vercel.app/auth/success?token=${token}`);
});

router.post("/signupUsingEmail", userController.signupUsingEmail);
router.post("/signinUsingEmail", userController.signinUsingEmail);

router.get("/getUser", (req, res) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(201).json({
            success: true,
            token,
            user: {
                _id: decoded._id,
                user_id: decoded.userId,
                full_name: decoded.full_name,
                email: decoded.email,
                bio: decoded.bio || "",
                profile_pic: decoded.profile_pic || "",
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }
});

module.exports = router; 