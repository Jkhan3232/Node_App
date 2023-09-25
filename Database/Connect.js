const mongoose = require("mongoose");

// database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection Successful...");
  } catch (error) {
    console.error(error, "jnn");
  }
};

module.exports = connectToDatabase;
