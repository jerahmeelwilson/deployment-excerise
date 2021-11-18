const express = require("express");
const path = require("path");

const app = express();

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "33bd0a606a2140c08709b3dd4a9cd35f",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

rollbar.log("Hello world!");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

let users = ["Jerahmeel, Jack"];

app.get("/users", (req, res) => {
  try {
    res.send(getUsers());
  } catch (error) {
    let ERROR = error;
    rollbar.error(ERROR);
    res.send("Error");
  }
});

app.get("addUser", (req, res) => {
  let name = "Jerahmeel";
  if (users.includes(name)) {
    res.send("user already exist");
    rollbar.warning("User already exist.");
  } else {
    users.push(name);
    res.send("user added");
  }
});

app.get("/styles", (req, res) => {
  res.sendFile(path.join(__dirname, "../styles.css"));
});

const port = process.env.PORT || 4005;

app.use(rollbar.errorHandler());

app.listen(port, () => {
  console.log(`App running on port number ${port}`);
});
