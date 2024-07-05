const User = require("../models/UserSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const { jwtToken } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");

exports.Home = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Home",
  });
};

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  if (!password || !confirmPassword) {
    return next(
      new ErrorHandler("Both password and confirmPassword are required", 400)
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords don't match", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    newUser,
    message: "Registration Successful",
  });
});

exports.logout = catchAsyncError(async (req, res, next) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }

  //checking the password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  jwtToken("Login successful", 200, user, res);
  const message = `You have successfully logged in to Mysore International School Website`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Login Successful",
      message,
    });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
});

exports.me = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return next(new ErrorHandler("Please login", 401));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("Email does not exist", 400));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/password/${resetToken}`;

  const message = `Your password reset token :- \n\n ${resetPasswordUrl} \n\n If You have not requested it then ,please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token",
      message,
    });

    res.status(200).json({
      success: true,
      message: `A link to reset your password has been sent to ${user.email}. Please make sure to check your inbox and spam `,
    });
  } catch (e) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(e.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Invalid token or token has been expired", 400)
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  jwtToken("Successfully updated password", 200, user, res);
});
