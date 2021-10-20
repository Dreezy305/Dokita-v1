const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/auth");

const saltRounds = 10;
// Maximum of eight characters and , at least one uppercase letter, one lowercase letter and one number:
const PasswordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const EmailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function signUp(req, res) {
  let {
    firstName,
    lastName,
    sex,
    city,
    country,
    phoneNumber,
    email,
    password,
    password_confirmation,
  } = req.body;

  let errors = [];

  if (!firstName) {
    errors.push({ firstName: "please provide your first name" });
  }

  if (!lastName) {
    errors.push({ lastName: "please provide your last name" });
  }

  if (!sex) {
    errors.push({ sex: "please provide your gender" });
  }

  if (!city) {
    errors.push({ city: "please provide your city" });
  }

  if (!country) {
    errors.push({ country: "please provide your country" });
  }

  if (!phoneNumber) {
    errors.push({ phoneNumber: "please provide your phone number" });
  }

  if (!email) {
    errors.push({ email: "please provide your email" });
  }

  if (!EmailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }

  if (!password) {
    errors.push({ password: "please provide your password" });
  }

  if (!PasswordRegexp.test(password)) {
    errors.push({ password: "invalid password" });
  }

  if (password_confirmation !== password) {
    errors.push({ password_confirmation: "password doesn't match" });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors: errors });
  }

  //  check if user exists
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ user: "email already exist" }] });
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
          console.log(err, "er1");
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err("password incorrect");
            user.password = hash;
            user
              .save()
              .then((response) => {
                return res.status(200).json({
                  success: true,
                  message: "account created successfully",
                  result: response,
                });
              })
              .catch((err) => {
                console.log(err, "er2");
                return res.status(500).json({
                  success: false,
                  errors: [{ error: err }],
                });
              });
          });
        })
        .catch((err) => {
          console.log(err, "er3");
          return res.status(500).json({
            success: false,
            message: "something went wrong",
            errors: [{ error: err }],
          });
        });
    }
  });
}

function signIn(req, res) {
  console.log(req.body, "bb");

  let { email, password } = req.body;

  let errors = [];

  if (!email) {
    errors.push({ email: "please provide your email" });
  }

  if (!EmailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }

  if (!password) {
    errors.push({ password: "please provide your password" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  //check if email exist
  User.findOne({ email: email }).then((user) => {
    //check if user doesn't exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user doesn't exist, kindly register",
        errors: [{ user: "not found" }],
      });
    } else {
      //compare password
      console.log(user.password, "pp");
      console.log(password, "ppx");
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              success: false,
              message: "Incorrect password",
              errors: [{ password: "incorrect" }],
            });
          }
          //create accesstoken
          const accessToken = createAccessToken(user._id, user.email, 86400);
          //verify token
          jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
              console.log(err, "err is here");
              return res.status(400).json({
                errors: [{ error: err }],
              });
            } else if (decoded) {
              return res.status(200).json({
                success: true,
                accessToken: accessToken,
                message: user,
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            success: false,
            message: "Something went wrong",
            errors: [{ error: err }],
          });
        });
    }
  });
}

module.exports = { signUp, signIn };
