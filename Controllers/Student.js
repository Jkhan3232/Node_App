const Student = require("../Models/Students")
const { setCookies } = require("../Utils/features")
const bcrypt = require("bcrypt")
const zxcvbn = require('zxcvbn');
const nodemailer = require("nodemailer");

//OTP Genrate Function
const otpGenerator = () => {
  return Math.floor(Math.random() * 9000) + 1000;
}
//Define Transpoter for Set SMTP Service
const transporter = nodemailer.createTransport({
  host: process.env.HOST_NAME,
  port: process.env.PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Register endpoint
exports.addUser = async (req, res,) => {
  try {
    // Extract user data from request body
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        massage: "User Allready Exist"
      })
    }

    // Check password strength
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({
        success: false,
        massage: "Weak Password"
      })
    }

    // Hash password
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const newUser = new Student({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();
    setCookies(newUser, res, "Registers user successfully", 201)

  }
  catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// Function to send OTP to the user's email
const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: "<gshankhan4545@gmail.com>",
      to: email,
      subject: "Email OTP Verification",
      text: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
  }

  catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

};

// Login endpoint
exports.login = async (req, res) => {
  try {

    // Get email from request body
    const { email } = req.body;

    // Find user by email
    const user = await Student.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate OTP
    const otp = otpGenerator();
    // Save OTP to user object
    user.otp = otp;
    await user.save();

    // Send OTP to user's email
    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email"
    });
  }

  catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

};

//Verify Otp
exports.verifyOTP = async (req, res) => {
  try {
    // Get email and OTP from request body
    const { email, otp } = req.body;

    // Find user by email
    const user = await Student.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or OTP"
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or OTP"
      });
    }

    // Clear OTP from user object
    user.otp = null;
    await user.save();
    // Generate JWT token and set cookies
    setCookies(user, res, "login successfully..", 200)
  }

  catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({
      success: false, message:
        "Internal server error"
    });
  }

};

exports.getMe = (req, res) => {
  try {
    let token = req.cookies
    if (token) {
      return res.status(200).json({
        success: true,
        user: req.user
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Login Fisrts"
      });

    }
  }
  catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

};

// Update user endpoint
exports.updateUser = async (req, res) => {
  try {
    // Get user ID from request parameters
    const { id } = req.params;

    // Get updated user data from request body
    const { name, email, phone } = req.body;

    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Find user by ID
    const user = await Student.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if the logged-in user is the same as the user being updated
    if (req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    // Update user data
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Save updated user to database
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully"
    });

  }
  catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

};

// Delete user endpoint
exports.deleteUser = async (req, res) => {
  try {
    // Get user ID from request parameters
    const { id } = req.params;

    // Find user by ID
    const user = await Student.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete user from database
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  }

  catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

};

// Logout route
exports.logout = (req, res) => {
  try {
    // Clear the cookies or session data
    res.clearCookie("token", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_DEVELOPMENT === "Development" ? "Lax" : "None",
      secure: process.env.NODE_DEVELOPMENT === "Development" ? false : true
    });

    // Sending Logout Response
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
