const ramda = require("ramda");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Product = require("../models/Product");
const Collection = require("../models/Collection");
const {verifyToken, verifyAdmin} = require("../middlewares/auth");

router.get("/", (req, res) => {
    //Van a tener que hacer aquí un GET de búsqueda 
})

module.exports = router;
