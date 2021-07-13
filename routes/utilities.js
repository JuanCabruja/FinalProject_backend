const express = require("express");
const router = express.Router();

const Collection = require("../models/Collection");
const User = require("../models/user");

router.post("/", (req, res) => {
    let body = req.body
    console.log(body);

    let stringdata = body.searchForm;

    Collection.find({name: {$regex: stringdata, $options: 'ix' }}, (err, collections) => {
        if (err) {
            res.status(400).json({ok: false, err});
        } else {
            // res.status(200).json({ok: true, collections})
            User.find({username: {$regex: stringdata, $options: 'ix'}}, (err, users) => {
                res.status(200).json({ok: true, users, collections})
            })
        }
    })

})


module.exports = router;
