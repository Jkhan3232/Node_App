const mongoose = require("mongoose");

// database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Student-Api");
    console.log("Connection Successful...");
  } catch (error) {
    console.error(error, "jnn");
  }
};

module.exports = connectToDatabase;
