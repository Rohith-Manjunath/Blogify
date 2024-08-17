const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the title of your blog"],
      trim: true,
      maxlength: [90, "Title cannot exceed 90 characters"],
      minlength: [3, "Title should have at least 3 characters"],
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: [true, "Please add a description to your blog"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      users: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
