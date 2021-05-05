const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validationGenre } = require("../modules/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);
//temporary removed auth
router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    let { error } = validationGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
      name: req.body.name,
    });

    genre = await genre.save();

    res.send(genre);
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    // let {error} = validationGenre(req.body)
    // if (error) return res.status(400).send(error.details[0].message);

    // // let genre = Genre.find( i => i.id === parseInt(req.params.id))
    // let genre = Genre.findById(req.params.id)
    // if(!genre) return res.status(400).send('No such genre')

    // try {
    //     let result = await genre.save()
    //     res.send(result)
    // }
    // catch(ex) {
    //     res.send(ex.message)
    // }

    let { error } = validationGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
      }
    );

    if (!genre) return res.status(400).send("No such genre");

    res.send(genre);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    let genre = await Genre.findOneAndRemove(req.params.id);

    if (!genre) return res.status(400).send("No such genre");
    res.send(genre);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(400).send("No such genre");
    res.send(genre);
  })
);

module.exports = router;
