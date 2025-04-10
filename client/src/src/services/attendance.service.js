import api from './api';

/**
 * Get attendance for a class
 * @param {string} classId - Class ID
 * @param {Object} params - Query parameters (date, etc.)
 * @returns {Promise<Array>} - Attendance records
 */
export const getClassAttendance = async (classId, params = {}) => {
  try {
    const response = await api.get(`/attendance/class/${classId}`, { params });
    return response.attendance;
  } catch (error) {
    throw error;
  }
};

/**
 * Get attendance for a student
 * @param {string} studentId - Student ID
 * @param {Object} params - Query parameters (date range, class, etc.)
 * @returns {Promise<Array>} - Attendance records
 */
export const getStudentAttendance = async (studentId, params = {}) => {
  try {
    const response = await api.get(`/attendance/student/${studentId}`, { params });
    return response.attendance;
  } catch (error) {
    throw error;
  }
};

/**
 * Take attendance for a class
 * @param {string} classId - Class ID
 * @param {Array} attendanceData - Attendance data with student IDs and status
 * @param {string} date - Date of attendance (YYYY-MM-DD)
 * @returns {Promise<Object>} - Response data
 */
export const takeAttendance = async (classId, attendanceData, date) => {
  try {
    const response = await api.post(`/attendance/class/${classId}`, {
      attendance: attendanceData,
      date
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update attendance record
 * @param {string} attendanceId - Attendance record ID
 * @param {Object} data - Updated attendance data
 * @returns {Promise<Object>} - Updated attendance record
 */
export const updateAttendance = async (attendanceId, data) => {
  try {
    const response = await api.put(`/attendance/${attendanceId}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get attendance statistics
 * @param {Object} params - Query parameters (class, date range, etc.)
 * @returns {Promise<Object>} - Attendance statistics
 */
export const getAttendanceStats = async (params = {}) => {
  try {
    const response = await api.get('/attendance/stats', { params });
    return response.stats;
  } catch (error) {
    throw error;
  }
};

/**
 * Export attendance records
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Blob>} - File blob for download
 */
export const exportAttendance = async (filters = {}) => {
  try {
    const response = await api.get('/attendance/export', { 
      params: filters,
      responseType: 'blob' 
    });
    return response;
  } catch (error) {
    throw error;
  }
};
