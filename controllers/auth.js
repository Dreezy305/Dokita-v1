const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/auth");

const saltRounds = 10;
// Maximum of eight characters and , at least one uppercase letter, one lowercase letter and one number:
const PasswordRegexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$";
const EmailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
    password_confirmation,
  } = req.body;

  let errors = [];

  if (!firstName) {
    return errors.push({ firstName: "please provide your first name" });
  }

  if (!lastName) {
    return errors.push({ lastName: "please provide your first name" });
  }

  if (!sex) {
    return errors.push({ sex: "please provide your gender" });
  }

  if (!city) {
    return errors.push({ city: "please provide your city" });
  }

  if (!country) {
    return errors.push({ country: "please provide your country" });
  }

  if (!phoneNumber) {
    return errors.push({ phoneNumber: "please provide your phone number" });
  }

  if (!email) {
    return errors.push({ email: "please provide your email" });
  }

  if (!EmailRegexp.test(email)) {
    return errors.push({ email: "invalid" });
  }

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
          bcrypt.hash(password, salt, (err, hash) => {
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

function signIn(res, req, next) {
  let { email, password } = req.body;
  //check if email exist
  User.findOne({ email: email }).then((user) => {
    //check if user doesn't exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user doesn't exist, kindly register",
      });
    } else {
      //compare password
      console.log(user.password, "pp");
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              success: false,
              message: "Incorrect password",
            });
          }
          //create accesstoken
          createAccessToken = createAccessToken(user._id, user.email, 10000);
          //verify token
          jwt.verify(
            createAccessToken,
            process.env.TOKEN_SECRET,
            (err, decrypt) => {
              if (err) {
                console.log(err, "err is here");
                return res.status(400).json({
                  error: [{ error: err }],
                });
              } else if (decrypt) {
                return res.status(200).json({
                  success: true,
                  message: "token verified",
                  accessToken: createAccessToken,
                  user: user,
                });
              }
            }
          );
        })
        .catch((err) => {
          res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: [{ error: err }],
          });
        });
    }
  });
}

module.exports = { signUp, signIn };
