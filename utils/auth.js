const jwt = require("jsonwebtoken");

const createAccessToken = (userId, email, duration) => {
  const payload = {
    userId,
    email,
    duration,
  };
  return jwt.sign(payload.process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });
};

module.exports = { createAccessToken };
