const express = require("express");
const { loginRateLimiter, isAuthenticated } = require("../Middleware/auth.js")
const { addUser, getMe, login, verifyOTP, logout, updateUser, deleteUser } = require("../Controllers/Student");


const router = express.Router();

// This Routes Perform Post,Get,PUT,Delete Request
router.post("/register", addUser);
router.post("/login", login);
router.post("/verify", loginRateLimiter, verifyOTP);
router.get("/getdata", isAuthenticated, getMe);
router.post("/logout", isAuthenticated, logout);
router.put("/update/:id", isAuthenticated, updateUser);
router.delete("/delete/:id", isAuthenticated, deleteUser);

//Export Router
module.exports = router;
