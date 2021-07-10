const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(require("./routes"));

app.use('/public', express.static('public'));

//TODO: Dejo aquí esto
app.set('etag', false)

mongoose.connect("mongodb://localhost:27017/SAFFO", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on("error", err => console.log("Connection to DB failed: ", err));
db.once("open", () => console.log("Connected to DB successfuly"));

app.listen(
    process.env.PORT,
    () => console.log("Listening on port ", process.env.PORT)
);