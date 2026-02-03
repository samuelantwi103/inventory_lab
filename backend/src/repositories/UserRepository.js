import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

/**
 * User Repository
 * Handles data access for User model
 * Extends BaseRepository for common CRUD operations
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email (including password for authentication)
   */
  async findByEmailWithPassword(email) {
    return await this.model.findOne({ email }).select('+password');
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    const user = await this.model.findOne({ email });
    return !!user;
  }
}

export default new UserRepository();
