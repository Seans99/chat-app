import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all the fields!")
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Minimum password length is 8!")
  }

  const checkUpperCase = (str) => {
    const chars = str.split('');
    if (chars[0] == chars[0].toUpperCase) {
      return true
    }
  }

  if (checkUpperCase(password) === false) {
    res.status(400);
    throw new Error("Password must begin with an uppercase!")
  }

  function stringContainsNumber(_string) {
    return /\d/.test(_string);
  }

  if (stringContainsNumber(password) === false) {
    res.status(400);
    throw new Error("password must contain a number!")
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const user = await User.create({
    name,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new user!")
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    })
  } else {
    res.status(400);
    throw new Error("Invalid email or password!")
  }
});

export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ]
  } : {

  }
  // Return all users except the current user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
  res.send(users);
});

export default registerUser;