const Blog = require("../Models/BlogModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createBlog = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const userId = req.user._id; // Accessing the user's _id directly

  const newBlog = await Blog.create({
    title,
    description,
    user: userId, // Assigning the userId to the user field
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    newBlog,
  });
});

exports.allBlogs = catchAsyncError(async (req, res, next) => {
  const blogs = await Blog.find().populate("user");
  res.status(200).json({
    success: true,
    blogs,
  });
});

exports.getSingleblog = catchAsyncError(async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await Blog.findById({ _id: blogId });
  if (!blog) {
    return next(new ErrorHandler("No blog found with this id", 404));
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

exports.deleteBlog = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  const { _id } = user;
  const { blogId } = req.params;
  const blog = await Blog.findById({ _id: blogId });
  if (!blog) {
    return next(new ErrorHandler("No blog found with this id", 404));
  }
  if (!(blog?.user?._id.toString() === _id.toString())) {
    return next(
      new ErrorHandler("You do not have permission to perform this action", 403)
    );
  }

  await Blog.deleteOne({ _id: blogId });
  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

exports.updateBlog = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  const { _id } = user;
  const { blogId } = req.params;
  const blog = await Blog.findById({ _id: blogId });
  if (!blog) {
    return next(new ErrorHandler("No blog found with this id", 404));
  }
  if (!(blog.user._id.toString() === _id.toString())) {
    return next(
      new ErrorHandler("You do not have permission to perform this action", 403)
    );
  }
  const { description, title } = req.body;

  blog.title = title;
  blog.description = description;

  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
  });
});
