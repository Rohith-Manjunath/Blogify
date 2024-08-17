const Blog = require("../models/BlogModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

exports.comment = catchAsyncError(async (req, res, next) => {
  const { comment } = req.body;
  const { id } = req.params;
  const userId = req.user._id; // Assuming user information is available in req.user

  // Find the blog post by ID
  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("No blog found", 404));
  }

  // Add the new comment to the blog's comments array
  blog.comments.push({ comment, user: userId });

  // Save the updated blog post
  await blog.save();

  // Respond with the updated blog post
  res.status(200).json({
    success: true,
    message: "Comment added successfully",
    blog,
  });
});

exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { commentId } = req.body;

  // Find the blog post by ID
  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("No blog found", 404));
  }

  // Check if the comment exists
  const commentIndex = blog.comments.findIndex(
    (comment) => comment._id.toString() === commentId.toString()
  );
  if (commentIndex === -1) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  // Remove the comment from the comments array
  blog.comments.splice(commentIndex, 1);

  // Save the updated blog post
  await blog.save();

  // Respond with a success message
  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
