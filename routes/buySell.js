const ramda = require("ramda");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const User = require("../models/user");
let Product = require("../models/Product")
const Collection = require("../models/Collection");
const buy_Sell = require("../models/Buy_Sell")

const {verifyToken} = require("../middlewares/auth");




// Una vez se confirme el proceso de pago se ejecuta este documento que registra la transacción
// Y modifica base de datos del producto. 
// Por el momento y a efectos de la presentación la orden se ejecuta completándose la transacción.


// La idea es que una vez se inicia la transacción el usuario pueda validar desde su cuenta que ha recibido la prenda
// Una serie de estados para el producto. PENDING, DONE que dependiendo del valor actual de la prenda
// Si ha empezado la ejecución, una vez se cumpla el estado se procede a comprar.

router.post('/collections/:collectionId', verifyToken, (req, res) => {

    let body = req.body
    let userBuyer = body.userBuyer; 
    let userSeller = body.userSeller;  
    let price = body.price; 

    let parentCollection = body.parentCollection

    Product.findOne({parentCollection: parentCollection, product_Owner: userSeller}, (err, product) => {
        if  (err) {
            res.status(400).json({ok: false, error});
        } else if ( product === null) {
            res.status(400).json({ok: false, message: "all products have been sold"}) 
        } else { 
            const order = new buy_Sell({
                user_buyer: userBuyer, 
                user_seller: userSeller, 
                product_Id: product._id, 
                sale_price: price, 
                date: Date.now(),
                state: "COMPLETED", 
            })
            order.save((err, savedOrder) => {
                if (err) {

                    res.status(400).json({ok: false, error});

                } else {
                    
                    Product.updateOne({_id: product._id}, {product_Owner: userBuyer, $push: {product_History: savedOrder._id} },
                        (err, newProductStatus) => {
                            if (err){
                                res.status(400).json({ok: false, error});
                               
                            } else {
                            
                                res.status(200).json({ok: true, product, savedOrder, newProductStatus})

                            }
                        })
                }
            })
        }
    })
})

module.exports = router;


