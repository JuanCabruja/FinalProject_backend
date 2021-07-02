const express = require("express");
const router = express.Router();

const Collection = require("../models/Collection");
const User = require("../models/user");
const Product = require("../models/Product");

// Este Endpoint está en su mayoría dedicado a la gestión de la petición de productos de seguna mano. 
router.put("/")