const Blog = require("../models/BlogModel");
const User = require("../models/UserSchema");
const redis = require("../redis/redis");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const cloudinary = require("cloudinary");

// Create a blog with Cloudinary image upload and Redis cache invalidation
exports.createBlog = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "blogs",
    width: 400,
    height: 400,
    crop: "scale",
  });

  const { title, description } = req.body;
  const userId = req.user._id;

  const newBlog = await Blog.create({
    title,
    description,
    user: userId,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  // Invalidate Redis cache
  await redis.del("allBlogs");
  await redis.del("myBlogs");

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    newBlog,
  });
});

// Fetch all blogs with Redis caching
exports.allBlogs = catchAsyncError(async (req, res, next) => {
  const cachedBlogs = await redis.get("allBlogs");

  if (cachedBlogs) {
    return res.status(200).json({
      success: true,
      blogs: JSON.parse(cachedBlogs),
      message: "Fetched from cache",
    });
  }

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

  await redis.setEx("allBlogs", 300, JSON.stringify(blogs));

  res.status(200).json({
    success: true,
    blogs,
    message: "Fetched from database",
  });
});

// Get a single blog by ID
exports.getSingleblog = catchAsyncError(async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(new ErrorHandler("No blog found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

// Delete a blog by ID with Cloudinary image deletion
exports.deleteBlog = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new ErrorHandler("No blog found with this ID", 404));
  }

  if (blog.user._id.toString() !== _id.toString()) {
    return next(
      new ErrorHandler("You do not have permission to perform this action", 403)
    );
  }

  await cloudinary.uploader.destroy(blog.image.public_id);
  await Blog.deleteOne({ _id: blogId });

  await redis.del("allBlogs");
  await redis.del("myBlogs");

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});

// Update a blog by ID
exports.updateBlog = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(new ErrorHandler("No blog found with this ID", 404));
  }

  if (blog.user._id.toString() !== _id.toString()) {
    return next(
      new ErrorHandler("You do not have permission to perform this action", 403)
    );
  }

  const { title, description, image } = req.body;

  if (image) {
    await cloudinary.uploader.destroy(blog.image.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "blogs",
      width: 400,
      height: 400,
      crop: "scale",
    });

    blog.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  blog.title = title;
  blog.description = description;

  await blog.save();

  await redis.del("allBlogs");
  await redis.del("myBlogs");

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
  });
});

// Fetch blogs by the authenticated user
exports.myBlogs = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const cachedData = await redis.get("myBlogs");

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  const blogs = await Blog.find({ user: _id }).sort({ createdAt: -1 });
  await redis.setEx("myBlogs", 3600, JSON.stringify(blogs));

  res.status(200).json({
    success: true,
    blogs,
  });
});

// Fetch blogs liked by a user
exports.likedBlogs = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Try to fetch likedBlogs from Redis cache
  const cachedLikedBlogs = await redis.get(`likedBlogs_${id}`);
  if (cachedLikedBlogs) {
    return res.status(200).json({
      success: true,
      blogs: JSON.parse(cachedLikedBlogs),
      message: "Fetched from cache",
    });
  }

  // If not cached, fetch from the database
  const user = await User.findById(id).populate({
    path: "liked",
    populate: {
      path: "user", // Assuming the Blog schema has a 'user' field
      select: "name avatar", // Selecting name and avatar fields
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const likedBlogs = user.liked;

  // Cache the liked blogs for future requests (e.g., 300 seconds)
  await redis.setEx(`likedBlogs_${id}`, 300, JSON.stringify(likedBlogs));

  res.status(200).json({
    success: true,
    blogs: likedBlogs,
  });
});

// Like or dislike a comment on a blog
exports.likeDislikeComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;
  const { blogId } = req.body;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  const comment = blog.comments.find(
    (comment) => comment._id.toString() === commentId.toString()
  );
  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  const hasUserLiked = comment.likes.users.some(
    (user) => user.toString() === req.user._id.toString()
  );

  if (hasUserLiked) {
    comment.likes.users = comment.likes.users.filter(
      (user) => user.toString() !== req.user._id.toString()
    );
  } else {
    comment.likes.users.push(req.user._id);
  }

  await blog.save();

  res.status(200).json({
    success: true,
    likes: comment.likes.users.length,
  });
});
