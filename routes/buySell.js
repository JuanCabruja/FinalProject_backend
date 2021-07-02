const ramda = require("ramda");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Product = require("../models/Product");
const Collection = require("../models/Collection");
const buy_Sell = require("../models/Buy_Sell")
const {verifyToken, verifyAdmin} = require("../middlewares/auth");




// Esto irá asumo después del procesado del pago. 
route.post('store/:product', (req, res) => {

    let body = req.body
    let userBuyer = body.userBuyer; 
    let userSeller = body.userSeller;  // No tendría por qué ser todo el objeto xq en relaidad no basta con el id 
    let price = body.price; 

    const Order = new buy_Sell({



    })




})

// TODO: Gestionando aquí toda la lógica, una vez el consumidor reciba el producto puede marcar que lo ha recibido
// asumo que para ello tendré que depurar de cierta forma o establecer algún modelo relacional. 
// Tu podrías

// Una serie de estados para el producto. PENDING, DONE que dependiendo del valor actual de la prenda
// Si ha empezado la ejecución, una vez se cumpla el estado se procede a comprar.