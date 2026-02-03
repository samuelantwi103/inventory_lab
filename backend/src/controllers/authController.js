import asyncHandler from '../middleware/asyncHandler.js';
import AuthService from '../services/AuthService.js';

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 * Follows Single Responsibility Principle
 */

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await AuthService.register({ name, email, password });

  res.status(201).json({
    success: true,
    data: { user, token },
    message: 'User registered successfully',
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await AuthService.login(email, password);

  res.status(200).json({
    success: true,
    data: { user, token },
    message: 'Login successful',
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {},
    message: 'Logout successful',
  });
});
