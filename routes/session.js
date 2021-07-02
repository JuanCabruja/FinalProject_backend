const ramda = require("ramda");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const {verifyToken, verifyAdmin} = require("../middlewares/auth");

router.get("/", verifyToken, (req, res) => {
  
     let token = req.get("authorization");
     token = token && token.split(" ")[1];
     const user = jwt.decode(token)?.user; // obtiene el payload con la información del usuario

    User.findOne({username: user.username}, (error, userDB) => {
        if(error) {
            res.status(500).json({ok: false, error});
        
        } else if(!userDB) {
            res.status(400).json({
                ok: false,
                error: {message: "Email not found"}
            });
        } else {
            const token = jwt.sign(
                {user: userDB}, // payload
                "SECRET KEY",
                {expiresIn: 60 * 30}
            );

            res.status(200).json({ok: true, token, user: userDB});
        }
    })
});

module.exports = router;