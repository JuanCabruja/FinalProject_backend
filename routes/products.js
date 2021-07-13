const express = require("express");
const router = express.Router();

const Collection = require("../models/Collection");
const User = require("../models/user");
const Product = require("../models/Product");

// Este Endpoint está en su mayoría dedicado a la gestión de la petición de productos de seguna mano. 
// Posiblemente no llegue para implementarla. 

// Query a todos los productos.
router.get("/", (req, res) => {

    Product.find({$and: [{product_Owner: {$ne: parentCollection.author}}]}, (err, products) => {
      Collection.populate(
        products,
        { path: "parentCollection" },
        (err, products) => {
          if (err) {
            res.status(400).json({ ok: false, err });
          } else {
            res.status(200).json({ ok: true, products });
          }
        }
      );
    });

    Collection.find({}, )

  });
  

  module.exports = router;