import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

/**
 * Authentication Service
 * Handles business logic for user authentication
 * Follows Single Responsibility Principle
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    // Check if user already exists
    const emailExists = await UserRepository.emailExists(userData.email);
    
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await UserRepository.create(userData);

    // Generate token
    const token = this.generateToken(user._id);

    return { user, token };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user by email (including password)
    const user = await UserRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    return { user, token };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();
