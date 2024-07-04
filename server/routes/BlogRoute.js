const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/isAuthenticated");
const {
  createBlog,
  allBlogs,
  getSingleblog,
  deleteBlog,
  updateBlog,
} = require("../controllers/BlogController");
const router = express.Router();

router.route("/create").post(isAuthenticatedUser, createBlog);
router.route("/blogs").get(allBlogs);
router
  .route("/blog/:blogId")
  .get(isAuthenticatedUser, getSingleblog)
  .delete(isAuthenticatedUser, deleteBlog)
  .put(isAuthenticatedUser, updateBlog);

module.exports = router;
