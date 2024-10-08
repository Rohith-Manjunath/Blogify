const Blog = require("../models/BlogModel");
const User = require("../models/UserSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const cloudinary = require("cloudinary");

exports.createBlog = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "test",
    width: 400,
    height: 400,
    crop: "scale",
  });

  const { title, description } = req.body;
  const userId = req.user._id; // Accessing the user's _id directly

  const newBlog = await Blog.create({
    title,
    description,
    user: userId, // Assigning the userId to the user field
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    newBlog,
  });
});

exports.allBlogs = catchAsyncError(async (req, res, next) => {
  const blogs = await Blog.find()
    .populate("user")
    .populate({
      path: "likes.users",
      select: "name",
    })
    .populate({
      path: "comments.user",
      select: "name avatar.url",
    });

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
  if (!(blog.user._id.toString() === _id.toString())) {
    return next(
      new ErrorHandler("You do not have permission to perform this action", 403)
    );
  }

  await cloudinary.uploader.destroy(blog.image.public_id);

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
  const { description, image, title } = req.body;

  if (!image || typeof image === "undefined" || typeof image === "") {
    blog.title = title;
    blog.description = description;
  } else {
    await cloudinary.uploader.destroy(blog.image.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "test",
      width: 400,
      height: 400,
      crop: "scale",
    });

    blog.title = title;
    blog.description = description;
    blog.image = blog.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
  });
});

exports.myBlogs = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const blogs = await Blog.find({ user: _id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    blogs,
  });
});

exports.likedBlogs = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Find the user and get their liked blogs along with the user information for each liked blog
  const user = await User.findById(id).populate({
    path: "liked",
    populate: {
      path: "user", // Assuming the field in the Blog schema that references the User model is called 'user'
      select: "name avatar", // Only select the name and avatar fields
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const likedBlogs = user.liked;

  res.status(200).json({
    success: true,
    blogs: likedBlogs,
  });
});

exports.likeDislikeComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;
  const { blogId } = req.body;

  // Find the blog by ID
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  // Find the specific comment within the blog
  const comment = blog?.comments?.find(
    (comment) => comment._id.toString() === commentId.toString()
  );
  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  // Check if the user has already liked the comment
  const hasUserLiked = comment?.likes?.users?.some(
    (user) => user.toString() === req.user._id.toString()
  );

  if (hasUserLiked) {
    // If the user has already liked the comment, unlike it
    comment.likes = comment?.likes?.users?.filter(
      (user) => user.toString() !== req.user._id.toString()
    );
  } else {
    // If the user has not liked the comment, add the user's ID to the likes array
    comment?.likes?.users?.push(req.user._id);
  }

  // Save the blog document
  await blog.save();

  res.status(200).json({
    success: true,
    likes: comment.likes.length, // Returning the number of likes
  });
});
