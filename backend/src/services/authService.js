// src/services/authService.js
const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

/**
 * Service layer for authentication logic
 * Handles user registration and login
 */

const registerUser = async (email, password, firstName, lastName) => {
  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }

  // Create new user
  user = new User({
    email,
    password,
    firstName,
    lastName,
  });

  user.username = user._id.toString(); // Set username to user ID for now 

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: user.toJSON(),
  };
};

const loginUser = async (email, password) => {
  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: user.toJSON(),
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).populate('savedTrips');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserProfile = async (userId, updates) => {
  // Don't allow password updates via this method
  delete updates.password;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
};
