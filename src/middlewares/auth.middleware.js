const jwt = require('jsonwebtoken');

const isAuthenticatedOrHasToken = async (req, res, next) => {
    // Check if authenticated via session (Google OAuth)
    if (req.isAuthenticated()) {
        req.user = {
            _id: req.session.passport.user.id,
            user_id: req.session.passport.user.user_id,
            full_name: req.session.passport.user.full_name,
            email: req.session.passport.user.email,
            bio: req.session.passport.user.bio || "",
            profile_pic: req.session.passport.user.profile_pic || ""
        };
        return next();
    }

    // Check if authenticated via JWT
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded._id,
            user_id: decoded.userId,
            full_name: decoded.full_name,
            email: decoded.email,
            bio: decoded.bio || "",
            profile_pic: decoded.profile_pic || ""
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = { isAuthenticatedOrHasToken };