const express = require("express");
const passport = require("passport");
const userController = require("../../controllers/user/user.controller");

const router = express.Router(); 

router.get("/google", passport.authenticate("google", { scope: ['profile', 'email']}));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }), (req, res) => {
    res.redirect(`http://localhost:5173/auth/success`);
})
router.post("/signupUsingEmail", userController.signupUsingEmail);
router.post("/signinUsingEmail", userController.signinUsingEmail);

router.get("/getUser", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: {
                _id: req.user.id,
                user_id: req.user.user_id,
                full_name: req.user.full_name,
                email: req.user.email,
                bio: req.user.bio || "",
                profile_pic: req.user.profile_pic || "",
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }
});

module.exports = router; 