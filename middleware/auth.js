const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    res.status(400).json({ msg: "Authentication invalid" });
  }

  jwt.verify(token, process.env.AccessTokenSecret, (err, payload) => {
    if (err) {
      res.status(400).json({ msg: "Authentication invalid" });
    }
    req.user = { id: payload.id };
  });

  next();
};

module.exports = auth;
