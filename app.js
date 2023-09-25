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
connectToDatabase();


//For Testing
app.get("/", (req, res) => {
  res.send("HI its Working")
})

//Listint Port
app.listen(port, () => {
  console.log(`Server is start on port No ${port} `);
});