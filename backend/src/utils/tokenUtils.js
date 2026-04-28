// src/utils/tokenUtils.js
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * Token expires in 30 days
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * Decode JWT token (for verification)
 */
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  decodeToken,
};
