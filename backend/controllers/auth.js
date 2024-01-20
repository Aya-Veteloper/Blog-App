const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

module.exports.register = asyncHandler(async (req, res) => {
  //validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Check if user exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already exists" });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hashPassword(req.body.password, salt);

  //save user to db
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });
  await user.save();

  //send response to client

  res
    .status(201)
    .json({ message: "you are registered successfully, please login" });
});

module.exports.login = asyncHandler(async (req, res) => {
  //validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //if user exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  //check password
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  //generate token (JWT)
  const token = User.generateAuthToken();
  //send response to client
  res.status(200).json({
    id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});
