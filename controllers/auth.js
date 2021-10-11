const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/auth");

const saltRounds = 10;
// Maximum of eight characters and , at least one uppercase letter, one lowercase letter and one number:
const myPlainTextPassword = "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{,8}$";

function signUp(req, res, next) {
  let {
    firstName,
    lastName,
    sex,
    city,
    country,
    phoneNumber,
    email,
    password,
  } = req.body;

  //  check if user exists
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "user already exist" });
    } else {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        sex: sex,
        city: city,
        country: country,
        phoneNumber: phoneNumber,
        email: email,
        password: password,
      });
      //  hash password with bcrypt js
      bcrypt
        .genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(myPlainTextPassword, salt, (err, hash) => {
            if (err) throw err("password incorrect ");
            user.password = hash;
            user
              .save()
              .then((response) =>
                res.status(200).json({
                  success: true,
                  message: "account created successfully",
                })
              )
              .catch((err) =>
                res.status(500).json({
                  success: false,
                  message: "there was an error",
                  errors: [{ errors: err }],
                })
              );
          });
        })
        .catch((err) =>
          res.status(500).json({
            success: false,
            message: "something went wrong",
            errors: [{ errors: err }],
          })
        );
    }
  });
}

function signIn(res, req, next) {}

module.exports = { signUp };
