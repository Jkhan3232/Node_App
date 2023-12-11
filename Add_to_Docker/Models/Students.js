const mongoose = require("mongoose");
const validator = require("validator");

// Create a new user schema 
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("put the velid email id");
      }
    },
  },

  phone: {
    type: Number,
    required: true,
    min: 10,
  },

  password: {
    type: String,
    require: true,
    unique: true,
    select: false,
  },
  otp: {
    type: String,
    default: null,
  },
  cratetedAt: {
    type: Date,
    default: Date.now,
  },
});

// Model Creatation
const Student = new mongoose.model("Student", studentSchema);
module.exports = Student;
