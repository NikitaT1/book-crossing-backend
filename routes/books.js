const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre } = require("../modules/genre");
const { Movie, validateMovie } = require("../modules/book");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const books = await Movie.find().sort("name");
    res.send(books);
  })
);

// delete auth middleware in router.post becouse of some bug
router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    let { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(400).send("No such genre");

    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      like: false,
    });
    let result = await movie.save();
    res.send(result);
  })
);

//auth removed,
router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      like: req.body.like,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

//update like status
router.put("/like/:id", async (req, res) => {
  // const { error } = validateMovie(req.body.like);
  // if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      like: req.body.like,
    },

    // { ...movie, like: req.body.like },
    { new: true }
  );

  // if (!movie)
  //   return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

//[auth, admin],
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
