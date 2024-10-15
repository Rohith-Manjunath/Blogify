const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/isAuthenticated");
const {
  createBlog,
  allBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/BlogController");
const { comment, deleteComment } = require("../controllers/CommentsController");
const router = express.Router();

router.route("/create").post(isAuthenticatedUser, createBlog);
router.route("/blogs").get(isAuthenticatedUser, allBlogs);
router
  .route("/blog/:blogId")
  .get(isAuthenticatedUser, getSingleBlog)
  .delete(isAuthenticatedUser, deleteBlog)
  .put(isAuthenticatedUser, updateBlog);
router
  .route("/comment/:id")
  .post(isAuthenticatedUser, comment)
  .delete(isAuthenticatedUser, deleteComment);

module.exports = router;
