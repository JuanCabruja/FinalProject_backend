const ramda = require("ramda");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();


const Product = require("../models/Product");
const Collection = require("../models/Collection");
const User = require("../models/user");

const upload = require('../libs/storage');

const {verifyToken, verifyAdmin} = require("../middlewares/auth");

router.get("/", async (req, res)  => {
    // Similar al find de Mongo. Si el filtro está vacío,
    // me devuelve todos los documentos.
    // TODO: Con este método se harán las peticiones 
    const PAGE_SIZE = 5;
    const page = req.query.page || 1;

    const count = await User.countDocuments();
     
    User.find({active: true})
    .skip(( page - 1) * PAGE_SIZE) // Número de documentos que saltará
    .limit(PAGE_SIZE) // Número de documentos que devolverá
    .exec((error, users) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } else {
            res.status(200).json({ok: true, page, pageSize: PAGE_SIZE, count, results: users});
        }
    })

});


router.get("/", async (req, res)  => {

    const PAGE_SIZE = 5;
    const page = req.query.page || 1;

    const count = await User.countDocuments();
     
    User.find({role: "CREATOR"})
    .skip(( page - 1) * PAGE_SIZE) // Número de documentos que saltará
    .limit(PAGE_SIZE) // Número de documentos que devolverá
    .exec((error, users) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } else {
            res.status(200).json({ok: true, page, pageSize: PAGE_SIZE, count, results: users});
        }
    })

});

router.get("/testAdmin", verifyToken, verifyAdmin, async (req, res)  => {
    res.status(200).json({message: "you are an admin!!"});
});

router.put("/:id", (req, res) => {

    const id = req.params.id;

    const body = ramda.pick(["username", "email"], req.body);
    
    User.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true, context: 'query' }, // options
        (error, updatedUser) => {
            if(error) {
                res.status(400).json({ok: false, error});
            } else {
                res.status(200).json({ok: true, updatedUser});
            }
        }
    );

});

// Este Delete podría servirme, pero tengo que ver el tema de la gestión por usuario o ID

// Código Users que voy quedándome para el final

// Creación de un nuevo usuario
router.post("/", (req, res) => {

    const body = req.body
  
    const user = new User({
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: bcrypt.hashSync(body.password, 10)
    });

    user.save((error, savedUser) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } 
        else {
            res.status(201).json({ok: true, savedUser});
        }

    });

});

// Código que nos da los creadores
// TODO: No terminado
router.get("/creators", async (req, res)  => {

    const PAGE_SIZE = 10;
    const page = req.query.page || 1;

    const count = await User.countDocuments();
     
    User.find({role: "CREATOR"})
    .skip(( page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE) 
    .exec((error, users) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } else {
            res.status(200).json({ok: true, page, pageSize: PAGE_SIZE, count, results: users});
        }
    })

});

// Request de info usuario y pobla el campo objetos.
router.get("/:username", async (req, res)  => {

    let usernameRaw = req.params.username;
    let username = usernameRaw.toLowerCase();

    User.findOne({username: username})
    .exec((error, user) => {
        if(error) {
            res.status(400).json({ok: false, error});
        } else if ( !user ) {
            res.status(404).json({ok: false, message: "This user does not exist"})
            
        } else if ( user.active == false){
            res.status(404).json({ok: false, message: "This user was deleted"})
        }
        else {
            let id = user._id;
            Product.find({product_Owner: id}, (err, products) => {
                if (err) {
                    res.status(400).json({ok: false, error});
                } else {
                    Collection.populate(products, {path: "parentCollection", select: "images"}, 
                    (err, products) => {
                    if (err) {
                        res.status(400).json({ok: false, err});
                    } else {
                        res.status(200).json({ok: true, user, products});
                    }
                    })
                }
            })
        }
    })

});

// Modificación del avatar del usuario. 
// TODO: No sé por qué me está dando este error

router.put("/:username/avatar_update", upload.single("avatar"),  (req, res) => {
    let usernameRaw = req.params.username;
    let username = usernameRaw.toLowerCase();
    let body = req.body;

    const url = req.protocol + '://' + req.get('host');
    const file = url + '/public/' + req.file.filename;
   

    // const file = req.file
    // if (!file) {
    //   const error = new Error('Please upload a file')
    //   error.httpStatusCode = 400
    //   return next(error)
    // }
    //   res.send(file)

    const filter = { _id: body._id };

    User.updateOne(filter, {avatar: file}, (err, user) => {
        if (err) {
            res.status(400).json({ok: false, err});
        } else {
            res.status(200).json({ok: true, user});
        }
    })

// Modificación de los valores del usuario
router.put("/:username/config", verifyToken, (req, res) => {
    let usernameRaw = req.params.username;
    let username = usernameRaw.toLowerCase();

    let body = req.body;
    let newUsername = body.username.toLowerCase();

    //Supongo que esto tendré que hacerlo para todos los valores de los usuarios
    //TODO: Preguntarle a Jesús alguna posible forma de hacer un código mas limpio y genérico

    User.findOneAndReplace({username: username}, 
        {username: newUsername, 
        email: body.email, 
        password:  bcrypt.hashSync(body.password, 10),
        }, (err, user) => {
        if (err) {
            res.status(400).json({ok: false, err});
        } else {
            res.status(200).json({ok: true, user});
        }
    })

    // User.updateOne({username: username}, 
    //     {username: newUsername, 
    //     email: body.email, 
    //     password:  bcrypt.hashSync(body.password, 10),
    //     }, (err, user) => {
    //     if (err) {
    //         res.status(400).json({ok: false, err});
    //     } else {
    //         res.status(200).json({ok: true, user});
    //     }
    // })

})



    // User.find({}, (err, user) => {
    //     if (err) {
    //         res.status(400).json({ok: false, err});
    //     } else {
    //         res.status(200).json({ok: true, user});
    //     }
    // })
})

router.delete("/:username/delete", verifyToken, (req, res) => {
    
    let usernameRaw = req.params.username;
    let username = usernameRaw.toLowerCase();

    let body = req.body;

    User.updateOne({username: username}, {active: false}, (err, user) => {
        if (err) {
            res.status(400).json({ok: false, err});
        } else {
            res.status(200).json({ok: true, user});
        }
    })

});



module.exports = router;