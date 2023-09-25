const mongoose = require("mongoose");

// database connection
const connectToDatabase = async (c) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connection Successfully..`);
  } catch (error) {
    console.error(error, "jnn");
  }
};

module.exports = connectToDatabase;
