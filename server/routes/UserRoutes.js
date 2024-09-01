const express = require("express");
const {
  registerUser,
  loginUser,
  me,
  Home,
  logout,
  forgotPassword,
  resetPassword,
  likeOrDislike,
  addProfilePicture,
  changePassword,
  followUnfollow,
  getUserData,
} = require("../controllers/UserController");
const { isAuthenticatedUser } = require("../middlewares/isAuthenticated");
const {
  myBlogs,
  likedBlogs,
  likeDislikeComment,
} = require("../controllers/BlogController");
const router = express.Router();

router.route("/").get(Home);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticatedUser, logout);
router.route("/me").get(isAuthenticatedUser, me);
router.route("/myBlogs").get(isAuthenticatedUser, myBlogs);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").put(resetPassword);
router.route("/changePassword").put(isAuthenticatedUser, changePassword);
router.route("/blog/like/:id").put(isAuthenticatedUser, likeOrDislike);
router.route("/blogs/liked/:id").get(isAuthenticatedUser, likedBlogs);
router.route("/profilePicture").post(isAuthenticatedUser, addProfilePicture);
router.route("/follow/:userId").put(isAuthenticatedUser, followUnfollow);
router.route("/user/:userId").get(getUserData);
router
  .route("/likeDislikeComment/:commentId")
  .put(isAuthenticatedUser, likeDislikeComment);

module.exports = router;
