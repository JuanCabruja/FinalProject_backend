const express = require("express");
const router = express.Router();

const Category = require("../models/Category");

router.post("/", (req, res) => {
    let body = req.body;
    
    const category = new Category({
        name: body.name,
        parent_category: body.parent_category
    });

    category.save((error, savedCategory) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } else {
            res.status(201).json({ok: true, savedCategory});
        }
    });
})

module.exports = router;