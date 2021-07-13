const express = require("express");
const app = express();

// ENDPOINTS

app.use("/users", require("./users"));
app.use("/login", require("./login"));
app.use("/collection", require("./collection"));
app.use("/category", require("./category"));
app.use("/session", require("./session"));
app.use("/buysell", require("./buySell"));
app.use("/market", require("./market"));
app.use("/utilities", require("./utilities"));
app.use("/products", require("./products"))

module.exports = app;