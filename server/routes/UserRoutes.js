const express = require("express");
const {
  registerUser,
  loginUser,
  me,
  Home,
  logout,
} = require("../controllers/UserController");
const { isAuthenticatedUser } = require("../middlewares/isAuthenticated");
const { myBlogs } = require("../controllers/BlogController");
const router = express.Router();

router.route("/").get(Home);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticatedUser, logout);
router.route("/me").get(isAuthenticatedUser, me);
router.route("/myBlogs").get(isAuthenticatedUser, myBlogs);

module.exports = router;
