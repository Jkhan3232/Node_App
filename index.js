require('dotenv').config()
const express = require("express");
const app = express();
const port = 2300;
const body_parser = require("body-parser")
const cookieParser = require('cookie-parser');
const taskrouter = require("./Routes/tasks");
const router = require("./Routes/routes");
const cors = require("cors")


app.use(body_parser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ['GET', "POST", "PUT", "DELETE"],
  credentials: true
}))

// connect to router
app.use("/api/student", router);
app.use("/api/task", taskrouter);


// connect to database
const connectToDatabase = require("./Database/Connect");
connectToDatabase(process.env.MONGODB_URI);


//For Testing
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Express App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-image: url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VydmVyfGVufDB8fDB8fHww&w=1000&q=80"); /* Replace with your background image URL */
      background-size: cover;
      background-position: center;
      height: 100vh;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .message-container {
      background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      backdrop-filter: blur(5px); /* Apply blur effect to the background */
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="message-container">
    <h1>Hi, it's working!</h1>
  </div>
</body>
</html>
`;

// Define a route that sends the HTML template
app.get("/", (req, res) => {
  try {
    res.status(200).send(htmlTemplate);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

//Listint Port
app.listen(port, () => {
  console.log(`Server is start on port No ${port} `);
});