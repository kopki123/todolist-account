const router = require("express").Router();
const {
  register,
  login,
  refreshtoken,
  logout,
} = require("../controllers/User");

router.post("/register", register);
router.post("/login", login);
router.get("/refresh_token", refreshtoken);
router.get("/logout", logout);

module.exports = router;
