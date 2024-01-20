const express = require("express");
const connectToDB = require("./config/connectToDB");
require("dotenv").config();

connectToDB = require("./config/connectToDB");

//Connect to Database
connectToDB();

//Init App
const app = express();

//Middleware
app.use(express.json());

//Running The Server
PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
