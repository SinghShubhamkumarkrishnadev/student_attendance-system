import api from './api';

/**
 * Get all classes with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of classes
 */
export const getAllClasses = async (params = {}) => {
  try {
    const response = await api.get('/classes', { params });
    return response.classes;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a class by ID
 * @param {string} id - Class ID
 * @returns {Promise<Object>} - Class data
 */
export const getClassById = async (id) => {
  try {
    const response = await api.get(`/classes/${id}`);
    return response.class;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new class
 * @param {Object} classData - Class data
 * @returns {Promise<Object>} - Created class data
 */
export const createClass = async (classData) => {
  try {
    const response = await api.post('/classes', classData);
    return response.class;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a class
 * @param {string} id - Class ID
 * @param {Object} classData - Updated class data
 * @returns {Promise<Object>} - Updated class data
 */
export const updateClass = async (id, classData) => {
  try {
    const response = await api.put(`/classes/${id}`, classData);
    return response.class;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a class
 * @param {string} id - Class ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/classes/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get students in a class
 * @param {string} id - Class ID
 * @returns {Promise<Array>} - List of students
 */
export const getClassStudents = async (id) => {
  try {
    const response = await api.get(`/classes/${id}/students`);
    return response.students;
  } catch (error) {
    throw error;
  }
};

/**
 * Add students to a class
 * @param {string} id - Class ID
 * @param {Array} studentIds - Array of student IDs to add
 * @returns {Promise<Object>} - Response data
 */
export const addStudentsToClass = async (id, studentIds) => {
  try {
    const response = await api.post(`/classes/${id}/students`, { studentIds });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove a student from a class
 * @param {string} classId - Class ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} - Response data
 */
export const removeStudentFromClass = async (classId, studentId) => {
  try {
    const response = await api.delete(`/classes/${classId}/students/${studentId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get attendance records for a class
 * @param {string} id - Class ID
 * @param {Object} params - Query parameters (date range, etc.)
 * @returns {Promise<Array>} - List of attendance records
 */
export const getClassAttendance = async (id, params = {}) => {
  try {
    const response = await api.get(`/classes/${id}/attendance`, { params });
    return response.attendance;
  } catch (error) {
    throw error;
  }
};

/**
 * Get class schedule
 * @param {string} id - Class ID
 * @returns {Promise<Array>} - Class schedule
 */
export const getClassSchedule = async (id) => {
  try {
    const response = await api.get(`/classes/${id}/schedule`);
    return response.schedule;
  } catch (error) {
    throw error;
  }
};

/**
 * Update class schedule
 * @param {string} id - Class ID
 * @param {Array} scheduleData - Schedule data
 * @returns {Promise<Object>} - Updated schedule
 */
export const updateClassSchedule = async (id, scheduleData) => {
  try {
    const response = await api.put(`/classes/${id}/schedule`, { schedule: scheduleData });
    return response.schedule;
  } catch (error) {
    throw error;
  }
};


// Add these functions to your existing class.service.js

/**
 * Get all classes (alias for getAllClasses for compatibility)
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of classes
 */
export const getClasses = async (params = {}) => {
  return getAllClasses(params);
};

/**
 * Remove a professor from a class
 * @param {string} classId - Class ID
 * @param {string} professorId - Professor ID
 * @returns {Promise<Object>} - Response data
 */
export const removeProfessorFromClass = async (classId, professorId) => {
  try {
    const response = await api.delete(`/classes/${classId}/professors/${professorId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
