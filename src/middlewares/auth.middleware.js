const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
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

module.exports = { isAuthenticated };