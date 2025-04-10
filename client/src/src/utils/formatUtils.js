/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return 'N/A';
    
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      const dateObj = new Date(date);
      return new Intl.DateTimeFormat('en-US', mergedOptions).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };
  
  /**
   * Format a date to include time
   * @param {string|Date} date - The date to format
   * @returns {string} Formatted date and time string
   */
  export const formatDateTime = (date) => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      console.error('DateTime formatting error:', error);
      return 'Invalid Date';
    }
  };
  
  /**
   * Format a time string (HH:MM)
   * @param {string} timeString - Time string in format "HH:MM" or "HH:MM:SS"
   * @returns {string} Formatted time string (e.g., "2:30 PM")
   */
  export const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      // Create a date object for today with the specified time
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('Time formatting error:', error);
      return timeString; // Return original if parsing fails
    }
  };
  
  /**
   * Format a number as a percentage
   * @param {number} value - The value to format (0-1)
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage string
   */
  export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return 'N/A';
    
    try {
      return `${(value * 100).toFixed(decimals)}%`;
    } catch (error) {
      console.error('Percentage formatting error:', error);
      return 'Invalid Value';
    }
  };
  
  /**
   * Truncate a string if it exceeds the maximum length
   * @param {string} str - The string to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated string with ellipsis if needed
   */
  export const truncateString = (str, maxLength = 50) => {
    if (!str) return '';
    
    if (str.length <= maxLength) return str;
    
    return `${str.substring(0, maxLength)}...`;
  };
  
  /**
   * Format a name to title case
   * @param {string} name - The name to format
   * @returns {string} Name in title case
   */
  export const formatName = (name) => {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Format a phone number to a readable format
   * @param {string} phone - The phone number to format
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.charAt(0) === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // If the format doesn't match expected patterns, return as is
    return phone;
  };
  
  /**
   * Convert a string to sentence case
   * @param {string} str - The string to convert
   * @returns {string} String in sentence case
   */
  export const toSentenceCase = (str) => {
    if (!str) return '';
    
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  