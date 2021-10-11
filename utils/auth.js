const jwt = require("jsonwebtoken");

const createAccessToken = (userId, email, duration) => {
  const payload = {
    userId,
    email,
    duration,
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });
};

//const verifyAccessToken =
//  (createAccesstoken,
//  process.env.TOKEN_SECRET,
//  (err, result) => {
//    if (err) {
//      return res.status(500).json({
//        success: false,
//        message: "invalid token",
//        error: [{ error: err }],
//      });
//    }
//  });

module.exports = { createAccessToken };
