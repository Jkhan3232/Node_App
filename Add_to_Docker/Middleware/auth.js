const jwt = require('jsonwebtoken');
const Student = require("../Models/Students")
const rateLimit = require('express-rate-limit');

exports.loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 login attempts per IP within the window
    message: "Too many login attempts. Please try again later.",
});


exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(402).json({ message: "Please Login" });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRATE_KEY);

        // Get the user ID from the decoded token
        const userId = decoded.userId;

        // Find the user by ID
        const user = await Student.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Attach the user object to the request for future route handlers
        req.user = user;

        // Set the Content-Type header
        res.setHeader("Content-Type", "application/json");

        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
