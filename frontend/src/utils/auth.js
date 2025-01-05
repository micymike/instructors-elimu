import axios from 'axios';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL || 'https://centralize-auth-elimu.onrender.com';
const BACKEND_API_URL = 'http://localhost:3000';

export const auth = {
  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : null;
  },

  setToken(token) {
    if (token) {
      // Ensure token has Bearer prefix
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      localStorage.setItem(TOKEN_KEY, formattedToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getAuthHeader() {
    const token = this.getToken();
    return token ? { 
      'Authorization': token,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  },

  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  async login(email, password) {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/auth/login/instructor`, { 
        email, 
        password 
      });

      const { access_token, user } = response.data;
      
      if (!access_token) {
        throw new Error('Invalid response format - no access token');
      }

      this.setToken(access_token);
      this.setUser(user);

      return { access_token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${AUTH_BASE_URL}/auth/refresh`, {
        token: token.replace(/^Bearer\s+/i, '')
      });

      if (!response.data.access_token) {
        throw new Error('Invalid refresh response format');
      }

      this.setToken(response.data.access_token);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  },

  async validateToken(token) {
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/auth/validate`, 
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
    // Clear any other auth-related storage
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  getAuthApiUrl() {
    return AUTH_BASE_URL;
  },

  getBackendApiUrl() {
    return BACKEND_API_URL;
  }
};
