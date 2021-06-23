const express = require("express");
const router = express.Router();

const Collection = require("../models/Collection");
const User = require("../models/user");

router.post("/", (req, res) => {
    let body = req.body;

    const collection = new Collection({
        name: body.name,
        category: body.category,
        supply: body.supply,
        price: body.price,
        description: body.description,
        author: body.author
    });

    collection.save((error, savedCollection) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } else {
            res.status(201).json({ok: true, savedCollection});
        }
    });
});

router.get("/", (req, res) => {
    Collection.find( {}, (err, collections) => {
        User.populate(collections, {path: "author"},
         (err, collections) => {
            res.status(200).send(collections);
        })
        
    });
});

module.exports = router;