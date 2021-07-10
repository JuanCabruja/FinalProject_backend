const express = require("express");
const router = express.Router();

const Collection = require("../models/Collection");
const User = require("../models/user");
const Product = require("../models/Product");

const upload = require("../libs/storage");

const { verifyCreator } = require("../middlewares/auth");

// Aquí iré poniendo el código nuevo y Limpio.

router.post(
  "/",
  verifyCreator,
  upload.array("collectionImages", 10),
  (req, res) => {
    // Tomando los datos básicos.
    let body = req.body;

    //TODO: El Front está bastante avanzado, me falta revisar los diseños responsive
    //Limpiar código etc, PERO TENGO QUE HACER LAS GESTIONES DE SEGURIDAD DE LA PÁGINA

    // Codigo que almacena las direcciones de las imágenes en un array
    const collectionFiles = [];
    const url = req.protocol + "://" + req.get("host");
    for (let i = 0; i < req.files.length; i++) {
      collectionFiles.push(url + "/public/" + req.files[i].filename);
    }

    const collection = new Collection({
      name: body.collectionName,
      supply: body.collectionSupply,
      available: body.collectionSupply,
      price: body.collectionPrice,
      description: body.collectionDescription,
      author: body.author,
      images: collectionFiles,
      available: body.collectionSupply,
      description: body.description,
      categories: body.categories
    });

    collection.save((error, savedCollection) => {
      if (error) {
        res.status(400).json({ ok: false, error});
      } else {
        const supply = body.collectionSupply;
        for (let i = 0; i < supply; i++) {
          const products = new Product({
            product_Owner: body.author,
            product_Sale_Price: body.collectionPrice,
            parentCollection: collection._id,
            productNumberInCollection: i + 1,
          });

          products.save((error, savedProduct) => {
            if (error) {
              return res.status(400).json({ ok: false, error });
            } else {
               
            }
            
          });  
        }
        res.status(201).json({ ok: true, savedCollection, body });
      }
    });
  }
);

// Query a todas las colecciones
router.get("/", (req, res) => {
  Collection.find({}, (err, collection) => {
      if (err) {
          res.status(400).json({ok: false, err})
      } else {
            User.populate(
            collection,
            { path: 'author' , select: ["username", "email", "avatar"]},
            (err, collection) => {
                if (err) {
                res.status(400).json({ ok: false, err });
                } else {
                res.status(200).json({ ok: true, collection });
                }
            }
            );
}})
})

//Query a una colección discriminando categorías. 
router.post("/filter", (req, res) => {
    let body = req.body; 

    Collection.find({categories: {$in: [body.map(category => ( category.value))]}}, (err, collections) => {
        if (err) {
            res.status(400).json({ok: false, err});
        } else {
            User.populate(
                collections,
                { path: 'author' , select: ["username", "email", "avatar"]},
                (err, collections) => {
                    if (err) {
                    res.status(400).json({ ok: false, err });
                    } else {
                    res.status(200).json({ ok: true, collections });
                    }
                }
                );  
        }
    })

})

// Query a Una colección
router.get("/details/:collectionId", (req, res) => {
  const collectionId = req.params.collectionId;

  Collection.find({ _id: collectionId }, (err, collection) => {
    if (err) {
      res.status(400).json({ ok: false, err, message: "collection not found" });
    } else {
        {
            User.populate(
            collection,
            { path: 'author' , select: ["username", "email", "avatar"]},
            (err, collection) => {
                if (err) {
                res.status(400).json({ ok: false, err });
                } else {
                res.status(200).json({ ok: true, collection });
                }
            }
            );
}
    }
  });
});



// Query a todos los productos.
router.get("/products", (req, res) => {
  Product.find({}, (err, products) => {
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
});

router.delete("/", (req, res) => {
  res.json({ answer: "hola" });
  // No veo un Delete, por lo menos no acá.
});

module.exports = router;

// Objeto de prueba para el request
// {
//     "name" : "FaldaRoja",
//     "category" : "mujer",
//     "supply" : "5",
//     "price" : "5",
//     "description" : "Faldas Rojas",
//     "author" : "60d7c02f12dfd107af418f0d"
// }
