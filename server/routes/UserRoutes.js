const express = require("express");
const {
  registerUser,
  loginUser,
  me,
  Home,
} = require("../controllers/UserController");
const { isAuthenticatedUser } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.route("/").get(Home);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(isAuthenticatedUser, me);

module.exports = router;
