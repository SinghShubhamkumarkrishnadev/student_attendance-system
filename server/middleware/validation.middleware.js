const { errorResponse } = require('../utils/response.utils');

/**
 * Validate HOD registration data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateHODRegistration = (req, res, next) => {
  const { collegeName, username, password, email } = req.body;
  
  // Check if all required fields are present
  if (!collegeName || !username || !password || !email) {
    return errorResponse(res, 'All fields are required', 400);
  }
  
  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, 'Please provide a valid email address', 400);
  }
  
  // Validate username length
  if (username.length < 3) {
    return errorResponse(res, 'Username must be at least 3 characters long', 400);
  }
  
  // Validate password length
  if (password.length < 6) {
    return errorResponse(res, 'Password must be at least 6 characters long', 400);
  }
  
  next();
};

/**
 * Validate OTP verification data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateOTP = (req, res, next) => {
  const { email, otp } = req.body;
  
  // Check if all required fields are present
  if (!email || !otp) {
    return errorResponse(res, 'Email and OTP are required', 400);
  }
  
  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, 'Please provide a valid email address', 400);
  }
  
  // Validate OTP format (6 digits)
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return errorResponse(res, 'OTP must be 6 digits', 400);
  }
  
  next();
};

/**
 * Validate login data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  // Check if all required fields are present
  if (!username || !password) {
    return errorResponse(res, 'Username and password are required', 400);
  }
  
  next();
};

/**
 * Validate professor data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateProfessor = (req, res, next) => {
  const { name, username, password } = req.body;
  
  // Check if all required fields are present
  if (!name || !username || !password) {
    return errorResponse(res, 'Name, username, and password are required', 400);
  }
  
  // Validate username length
  if (username.length < 3) {
    return errorResponse(res, 'Username must be at least 3 characters long', 400);
  }
  
  // Validate password length
  if (password.length < 6) {
    return errorResponse(res, 'Password must be at least 6 characters long', 400);
  }
  
  next();
};

/**
 * Validate class data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateClass = (req, res, next) => {
  const { classId, className, division } = req.body;
  
  // Check if all required fields are present
  if (!classId || !className || !division) {
    return errorResponse(res, 'Class ID, class name, and division are required', 400);
  }
  
  next();
};

module.exports = {
  validateHODRegistration,
  validateOTP,
  validateLogin,
  validateProfessor,
  validateClass
};
