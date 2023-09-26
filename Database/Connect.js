// const mongoose = require("mongoose");

// const connectToDatabase = async (uri) => {
//   try {
//     const db = await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`Connection Successfully... ${db}`);
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//   }
// };

// module.exports = connectToDatabase(process.env.MO);
const mongoose = require("mongoose");

const connectToDatabase = async (atlasURI) => {
  try {
    const db = await mongoose.connect(atlasURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to the Atlas database at ${db.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the Atlas database:", error);
  }
};


module.exports = connectToDatabase;

