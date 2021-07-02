const express = require("express");
const app = express();

// ENDPOINTS

app.use("/users", require("./users"));
app.use("/login", require("./login"));
app.use("/collection", require("./collection"));
app.use("/category", require("./category"));
app.use("/session", require("./session"));

module.exports = app;