const ramda = require("ramda");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Collection = require("../models/Collection");
const User = require("../models/user");

const upload = require("../libs/storage");

const { verifyToken, verifyAdmin } = require("../middlewares/auth");

// Creación de un nuevo usuario
router.post("/", (req, res) => {
  const body = req.body;

  if (body.username == "" || body.email == "" || body.password == "") {
    res.status(400).json({ ok: true, message: "No inputs" });
  } else {
    const user = new User({
      username: body.username.toLowerCase(),
      email: body.email.toLowerCase(),
      password: bcrypt.hashSync(body.password, 10),
    });

    user.save((error, savedUser) => {
      if (error) {
        res.status(400).json({ ok: false, error });
      } else {
        res.status(201).json({ ok: true, savedUser });
      }
    });
  }
});

// Código que nos da los creadores
router.get("/creators", async (req, res) => {
  const PAGE_SIZE = 10;
  const page = req.query.page || 1;

  const count = await User.countDocuments();

  User.find({ role: "CREATOR", active: true })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .exec((error, users) => {
      if (error) {
        res.status(400).json({ ok: false, error });
      } else {
        res
          .status(200)
          .json({ ok: true, page, pageSize: PAGE_SIZE, count, results: users });
      }
    });
});

// Request de info usuario y pobla el campo objetos.

router.get("/:username", async (req, res) => {
  let usernameRaw = req.params.username;
  let username = usernameRaw.toLowerCase();

  // Fetch para usuarios.
  User.findOne({ username: username }).exec((error, user) => {
    if (error) {
      res.status(400).json({ ok: false, error });
    } else if (!user) {
      res.status(404).json({ ok: false, message: "This user does not exist" });
    } else if (user.active == false) {
      res.status(404).json({ ok: false, message: "This user was deleted" });
    } else if (user.role === "USER") {
      let id = user._id;
      Product.find({ product_Owner: id }, (err, products) => {
        if (err) {
          res.status(400).json({ ok: false, error });
        } else {
          Collection.populate(
            products,
            { path: "parentCollection" },
            (err, products) => {
              if (err) {
                res.status(400).json({ ok: false, err });
              } else {
                res.status(200).json({ ok: true, user, products });
              }
            }
          );
        }
      });
    } else if (user.role === "CREATOR") {
      let id = user._id;
      Collection.find({ author: id }, (err, collection) => {
        if (err) {
          res.status(400).json({ ok: false, err });
        } else {
          res.status(200).json({ ok: true, user, collection });
        }
      });
    }
  });
});

// Modificación del avatar del usuario.
router.put(
  "/:username/avatar_update",
  verifyToken,
  upload.single("avatar"),
  (req, res) => {
    let usernameRaw = req.params.username;
    let username = usernameRaw.toLowerCase();
    let body = req.body;

    const url = req.protocol + "://" + req.get("host");
    const file = url + "/public/" + req.file.filename;
    const filter = { _id: body._id };

    User.updateOne(filter, { avatar: file }, (err, user) => {
      if (err) {
        res.status(400).json({ ok: false, err });
      } else {
        res.status(200).json({ ok: true, user });
      }
    });
  }
);

// User username & description update.
router.put("/:username/updateUsername", verifyToken, (req, res) => {
  let body = req.body;
  const newUsername = body.newUsername.toLowerCase();
  const description = body.description;
  const filter = { _id: body.id, username: body.username };

  User.updateOne(
    filter,
    {
      username: newUsername,
      description: description,
    },
    (err, user) => {
      if (err) {
        res.status(400).json({ ok: false, err });
      } else {
        res.status(200).json({ ok: true, user, body });
      }
    }
  );
});

// User email update.
router.put("/:username/updateEmail", verifyToken, (req, res) => {
  let body = req.body;
  const newEmail = body.newEmail.toLowerCase();

  const filter = { _id: body.id, email: body.email };

  User.updateOne(
    filter,
    {
      email: newEmail,
    },
    (err, user) => {
      if (err) {
        res.status(400).json({ ok: false, err });
      } else {
        res.status(200).json({ ok: true, user, body });
      }
    }
  );
});

// User password update.
router.put("/:username/updatePassword", verifyToken, (req, res) => {
  let body = req.body;
  const newPassword = body.newPassword;
  const id = body.id;

  const filter = { _id: id };

  User.updateOne(
    filter,
    { password: bcrypt.hashSync(body.newPassword, 10) },
    (err, user) => {
      if (err) {
        res.status(400).json({ ok: false, err });
      } else {
        res.status(200).json({ ok: true, user });
      }
    }
  );
});

router.delete("/:username/delete", verifyToken, (req, res) => {
  let usernameRaw = req.params.username;
  let username = usernameRaw.toLowerCase();

  User.updateOne({ username: username }, { active: false }, (err, user) => {
    if (err) {
      res.status(400).json({ ok: false, err });
    } else {
      res.status(200).json({ ok: true, user });
    }
  });
});

module.exports = router;
