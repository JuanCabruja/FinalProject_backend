const express = require("express");
const app = express();

app.use("/users", require("./users"));
app.use("/login", require("./login"));
app.use("/collection", require("./collection"));

module.exports = app;