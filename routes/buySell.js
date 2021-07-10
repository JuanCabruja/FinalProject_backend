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




// Esto irá asumo después del procesado del pago. 
// Aunque también podría ser que esto sea un fetch a la iniciación del proceso de compra y venta. 
//TODO: Terminar de gestionar este concepto de TODOs

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
                state: "PENDING", 
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

// TODO: Gestionando aquí toda la lógica, una vez el consumidor reciba el producto puede marcar que lo ha recibido
// asumo que para ello tendré que depurar de cierta forma o establecer algún modelo relacional. 
// Tu podrías

// Una serie de estados para el producto. PENDING, DONE que dependiendo del valor actual de la prenda
// Si ha empezado la ejecución, una vez se cumpla el estado se procede a comprar.