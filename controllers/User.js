const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ msg: "user exist" });
      return;
    }

    const passwordHashed = await bcryptjs.hash(password, 10);

    const newUser = await User.create({ email, password: passwordHashed });

    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreahToken({ id: newUser._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/user/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.status(200).json({ msg: "register success", accessToken: accessToken });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ msg: "user doesn't exist" });
      return;
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.json({ msg: "password is incorrect" });
      return;
    }

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreahToken({ id: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/user/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.status(200).json({ msg: "login success", accessToken: accessToken });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const refreshtoken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ msg: "Please login or register" });
    }

    jwt.verify(refreshToken, process.env.RefreshTokenSecret, (err, payload) => {
      if (err) {
        return res.status(400).json({ msg: "Please login or register" });
      }

      console.log(payload.id);

      const accessToken = createAccessToken({ id: payload.id });
      res.status(200).json({ accessToken: accessToken });
    });

    res.status(200).json({ token: refreshToken });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { path: "/user/refresh_token" });
    res.json({ msg: "Logged out" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = { register, login, refreshtoken, logout };

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.AccessTokenSecret, {
    expiresIn: "20m",
  });
}

function createRefreahToken(payload) {
  return jwt.sign(payload, process.env.RefreshTokenSecret, {
    expiresIn: "7d",
  });
}
