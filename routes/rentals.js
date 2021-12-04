const express = require("express");
const Fawn = require("fawn");

const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

const router = express.Router();
Fawn.init("mongodb://localhost/vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid Customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Invalid Movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed...");
  }
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Movie.findByIdAndUpdate(
//     req.params.id,
//     { name: req.body.name },
//     { new: true }
//   );

//   if (!genre)
//     return res.status(404).send("The genre with the given id does not exist");

//   res.send(genre);
// });

// router.delete("/:id", async (req, res) => {
//   const genre = await Movie.findByIdAndRemove(req.params.id);

//   if (!genre)
//     return res.status(404).send("The genre with the given id does not exist");

//   res.send(genre);
// });

// router.get("/:id", async (req, res) => {
//   const genre = await Movie.findById(req.params.id);

//   if (!genre)
//     return res.status(404).send("The genre with the given id does not exist");

//   res.send(genre);
// });

module.exports = router;
