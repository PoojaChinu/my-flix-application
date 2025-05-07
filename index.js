const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const app = express();

const { Cinema, User } = require("./models");

//Allow mongoose to connect to database locally
mongoose.connect("mongodb://127.0.0.1:27017/Cinema");

// attach bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS in Express
const cors = require("cors");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // if a specific origin is not found on the list of allowed origins
        let message =
          "The CORS policy for this application does not allow access from origin" +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Creating API endpoints

// Get all list of Cinema
app.get(
  "/cinema",
  passport.authenticate("jwt", { session: false }),
  //   passport.authenticate("jwt", { session: false }),
  // It's an async function to handle the request
  async (req, res) => {
    // It uses the Mongose model to query the database and saving it in a variable
    await Cinema.find()
      .then((movies) => {
        // If the query is successful, Sends back 200 OK status
        res.status(200).json(movies);
      })
      // if there is an error querying a database, it logs the error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get movie by Title
app.get(
  "/movies/:title",
  // It is to handle the request
  async (req, res) => {
    // It uses the Mongoose model to query the database
    await Cinema.findOne({ Title: req.params.title })
      .then((movie) => {
        // if query is successful,  Sends back 200 OK status and saving it in a variable
        res.status(200).json(movie);
      })
      // if there is an error querying in the database, it logs an error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// Get movie by Genre Name
app.get(
  "/cinema/genre/:genreName",
  // It is to handle the request
  async (req, res) => {
    // it use mongoose model to query the database and saving it in a varibale
    await Cinema.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        // if the query is successful, sends back 200 OK status and saving it in a varibale
        res.status(200).json(movie);
      })
      // if there is an error querying in the database, it logs an error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// Get movie by Director Name
app.get(
  "/cinema/director/:directorName",
  // It is to handle the request
  async (req, res) => {
    // it uses Mongose model to query the database and saving it in a variable
    await Cinema.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        // if the query is successful, send back 200 OK status and saving it in a varibale
        res.status(200).json(movie);
      })
      // if there is an error querying a database, it logs an error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

// Get All Users
app.get(
  "/users",
  // It is to handle the request
  async (req, res) => {
    // It uses mongose model to query the databse and saving it into a variable
    await User.find()
      .then((movie) => {
        // if the query is successful, send back 200
        res.status(200).json(movie);
      })
      // if there is an error querying in a database, it logs an error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  }
);

// Create User
app.post(
  "/users",
  // It is to handle the request
  async (req, res) => {
    //it uses the moongoose model to query the database and saving it to a varibale
    await User.findOne({ Username: req.body.Username })
      .then((user) => {
        // if the user is found, send a response that it already exists
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          User.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Birthday: req.body.Birthday,
            Email: req.body.Email,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error:" + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// update User info

app.put(
  "/users/:Username",
  // it handles the request
  async (req, res) => {
    // it uses mongoose model to query the database and saving it to a varibale
    await User.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Birthday: req.body.Birthday,
          Email: req.body.Email,
          Password: req.body.password,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.err(err);
        res.status(500).send("Error:" + err);
      });
  }
);

//delete User

app.delete(
  "/users/:Username",
  // it handles the request
  async (req, res) => {
    await User.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res
            .status(400)
            .send({ result: `Username: ${req.params.Username} was not found` });
        } else {
          res
            .status(200)
            .send({ result: `Username: ${req.params.Username} was deleted` });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//listens the request
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
