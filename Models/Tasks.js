const mongoose = require("mongoose");

// Create a new task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    isCompleted: {
        type: Boolean,
        default: false,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cratetedAt: {
        type: Date,
        default: Date.now,
    },
});

// Model Creatation
const studentTask = new mongoose.model("studentTask", taskSchema);
module.exports = studentTask;
