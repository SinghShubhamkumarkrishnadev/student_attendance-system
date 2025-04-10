import { jwtDecode } from 'jwt-decode';

/**
 * Get the authentication token from local storage
 * @returns {string|null} The token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in local storage
 * @param {string} token - The token to store
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove the authentication token from local storage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if the current token is valid and not expired
 * @returns {boolean} True if token is valid, false otherwise
 */
export const isTokenValid = () => {
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

/**
 * Check if token will expire soon (within the specified minutes)
 * @param {number} minutesBuffer - Minutes before expiration to consider as "expiring soon"
 * @returns {boolean} True if token will expire soon, false otherwise
 */
export const isTokenExpiringSoon = (minutesBuffer = 5) => {
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwtDecode(token);
    const bufferInSeconds = minutesBuffer * 60;
    // Check if token will expire within the buffer time
    return decoded.exp < (Date.now() / 1000) + bufferInSeconds;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

/**
 * Get user role from token
 * @returns {string|null} User role or null if token is invalid
 */
export const getUserRoleFromToken = () => {
  const token = getToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get user ID from token
 * @returns {string|null} User ID or null if token is invalid
 */
export const getUserIdFromToken = () => {
  const token = getToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub; // 'sub' is a common JWT claim for subject (user ID)
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get token expiration time in seconds
 * @returns {number|null} Expiration time in seconds or null if token is invalid
 */
export const getTokenExpirationTime = () => {
  const token = getToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
