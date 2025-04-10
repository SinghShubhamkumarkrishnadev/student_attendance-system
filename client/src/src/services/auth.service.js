import api from './api';
import { setToken, removeToken } from '../utils/tokenUtils';

/**
 * Login HOD with username and password
 * @param {string} username - HOD username
 * @param {string} password - HOD password
 * @returns {Promise<Object>} - HOD data and token
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/hods/login', { username, password });
    
    if (response.data && response.data.token) {
      setToken(response.data.token);
      
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new HOD
 * @param {Object} hodData - HOD registration data
 * @returns {Promise<Object>} - Created HOD data
 */
export const register = async (hodData) => {
  try {
    // Validate data before sending
    if (!hodData.collegeName) throw new Error('College name is required');
    if (!hodData.username) throw new Error('Username is required');
    if (!hodData.password) throw new Error('Password is required');
    if (!hodData.email) throw new Error('Email is required');
    
    // Log the data being sent (without password)
    console.log('Sending registration data:', {
      collegeName: hodData.collegeName,
      username: hodData.username,
      email: hodData.email,
      password: '****' // Don't log actual password
    });
    
    const response = await api.post('/hods/register', hodData);
    return response.data;
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      console.error('Registration API error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.error('Registration error:', error.message);
    }
    throw error;
  }
};

export const registerHOD = register;

/**
 * Logout the current HOD
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Call logout endpoint if the API supports it
    await api.post('/hods/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    removeToken();
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Get current HOD information
 * @returns {Promise<Object>} - Current HOD data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/hods/me');
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh the authentication token
 * @returns {Promise<Object>} - New token
 */
export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/hods/refresh-token', {
      refreshToken: refreshTokenValue
    });
    
    if (response.data && response.data.token) {
      setToken(response.data.token);
      
      // Update refresh token if a new one is provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  } catch (error) {
    removeToken();
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - HOD email
 * @returns {Promise<Object>} - Response data
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/hods/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<Object>} - Response data
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/hods/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Change HOD password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response data
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/hods/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update HOD profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Updated HOD data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/hods/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify OTP
 * @param {string} email - HOD email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - Verification response
 */
export const verifyOTP = async (email, otp) => {
  try {
    // Validate inputs
    if (!email) throw new Error('Email is required');
    if (!otp) throw new Error('OTP is required');
    
    const response = await api.post('/hods/verify-otp', { email, otp });
    
    if (response.data && response.data.token) {
      setToken(response.data.token);
      
      // Store refresh token if provided
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

/**
 * Resend OTP
 * @param {string} email - HOD email
 * @returns {Promise<Object>} - Response data
 */
export const resendOTP = async (email) => {
  try {
    const response = await api.post('/hods/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get HOD profile
 * @returns {Promise<Object>} - HOD profile data
 */
export const getHODProfile = async () => {
  try {
    const response = await api.get('/hods/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};
