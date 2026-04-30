// src/controllers/authController.js
const { asyncHandler } = require('../middleware/errorHandler');
const authService = require('../services/authService');

/**
 * @POST /api/auth/register
 * Register a new user
 */
exports.register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const { token, user } = await authService.registerUser(email, password, firstName, lastName);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user,
  });
});

/**
 * @POST /api/auth/login
 * Login user
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user,
  });
});

/**
 * @GET /api/auth/me
 * Get current user profile (requires auth)
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @PUT /api/auth/me
 * Update user profile (requires auth)
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const user = await authService.updateUserProfile(req.user._id, updates);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * @POST /api/auth/reset-password
 * Reset password (simple: email + new password)
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  user = await User.findOne({ email });

  await authService.resetPasswordByEmail(email, newPassword);

  res.status(200).json({
    success: true,
    message: 'If the account exists, password has been reset.',
  });
});
