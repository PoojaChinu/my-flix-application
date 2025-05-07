const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define cinemaSchema
let cinemaSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String,
  },
  ImagePath: String,
  Featured: Boolean,
});

// Defining a User Schema

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: String,
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Creating a Model

// Model represnts the MongoDB collection Cinema
let Cinema = mongoose.model("Cinema", cinemaSchema, "Cinema");
let User = mongoose.model("User", userSchema, "User");

//Exporting the Models

// Model represnts the MongoDB collection
module.exports.Cinema = Cinema;
module.exports.User = User;
