import api from './api';

class AuthService {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user: object, token: string}>}
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  }

  /**
   * Register new user
   * @param {object} userData - {name, email, password}
   * @returns {Promise<{user: object, token: string}>}
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { user, token } = response.data.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user from localStorage
   * @returns {object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get token from localStorage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
