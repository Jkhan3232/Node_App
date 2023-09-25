const express = require("express");
const { isAuthenticated, } = require("../Middleware/auth")
const { createTask, updateTask, deleteTask, getTask } = require("../Controllers/Taks")



const router = express.Router();

// This Routes Perform Post,Get,PUT,Delete Request
router.get("/mytask", isAuthenticated, getTask)
router.post("/createTask", isAuthenticated, createTask);
router.put("/:id", isAuthenticated, updateTask)
router.delete("/:id", isAuthenticated, deleteTask)


//Export Router
module.exports = router;