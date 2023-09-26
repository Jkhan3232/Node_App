const jwt = require('jsonwebtoken');

exports.setCookies = (user, res, message, statusCode = 200) => {
    try {
        const token = jwt.sign({ userId: user._id }, process.env.SECRATE_KEY);
        const cookieOptions = {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
            sameSite: 'None', // Set SameSite to "None"
        };

        // Set the "Secure" attribute in production
        if (process.env.NODE_DEVELOPMENT !== "Development") {
            cookieOptions.secure = true;
        }

        // Set the cookie
        res.cookie("token", token, cookieOptions);

        // Send the response
        return res.status(statusCode).json({ success: true, message, token });
    } catch (error) {
        console.error("Error setting cookie:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

