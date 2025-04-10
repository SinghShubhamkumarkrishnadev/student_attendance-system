import api from './api';

/**
 * Get all students with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of students
 */
export const getAllStudents = async (params = {}) => {
  try {
    const response = await api.get('/students', { params });
    return response.students;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} - Student data
 */
export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.student;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new student
 * @param {Object} studentData - Student data
 * @returns {Promise<Object>} - Created student data
 */
export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/students', studentData);
    return response.student;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a student
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} - Updated student data
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`/students/${id}`, studentData);
    return response.student;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a student
 * @param {string} id - Student ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get classes enrolled by a student
 * @param {string} id - Student ID
 * @returns {Promise<Array>} - List of classes
 */
export const getStudentClasses = async (id) => {
  try {
    const response = await api.get(`/students/${id}/classes`);
    return response.classes;
  } catch (error) {
    throw error;
  }
};

/**
 * Enroll student in classes
 * @param {string} id - Student ID
 * @param {Array} classIds - Array of class IDs to enroll in
 * @returns {Promise<Object>} - Response data
 */
export const enrollStudentInClasses = async (id, classIds) => {
  try {
    const response = await api.post(`/students/${id}/classes`, { classIds });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove a student from a class
 * @param {string} studentId - Student ID
 * @param {string} classId - Class ID
 * @returns {Promise<Object>} - Response data
 */
export const removeStudentFromClass = async (studentId, classId) => {
  try {
    const response = await api.delete(`/students/${studentId}/classes/${classId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student's attendance records
 * @param {string} id - Student ID
 * @param {Object} params - Query parameters (date range, class, etc.)
 * @returns {Promise<Array>} - List of attendance records
 */
export const getStudentAttendance = async (id, params = {}) => {
  try {
    const response = await api.get(`/students/${id}/attendance`, { params });
    return response.attendance;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student's attendance statistics
 * @param {string} id - Student ID
 * @param {Object} params - Query parameters (date range, class, etc.)
 * @returns {Promise<Object>} - Attendance statistics
 */
export const getStudentAttendanceStats = async (id, params = {}) => {
  try {
    const response = await api.get(`/students/${id}/attendance/stats`, { params });
    return response.stats;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset student's password
 * @param {string} id - Student ID
 * @returns {Promise<Object>} - Response with new password
 */
export const resetStudentPassword = async (id) => {
  try {
    const response = await api.post(`/students/${id}/reset-password`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload student profile image
 * @param {string} id - Student ID
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} - Response with image URL
 */
export const uploadStudentImage = async (id, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Use axios directly to handle multipart/form-data
    const response = await api.post(`/students/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student by registration number
 * @param {string} regNumber - Student registration number
 * @returns {Promise<Object>} - Student data
 */
export const getStudentByRegNumber = async (regNumber) => {
  try {
    const response = await api.get(`/students/reg/${regNumber}`);
    return response.student;
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk import students
 * @param {Array} studentsData - Array of student data objects
 * @returns {Promise<Object>} - Import results
 */
export const bulkImportStudents = async (studentsData) => {
  try {
    const response = await api.post('/students/bulk-import', { students: studentsData });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload student CSV for bulk import
 * @param {File} csvFile - CSV file to upload
 * @returns {Promise<Object>} - Import results
 */
export const uploadStudentCSV = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    const response = await api.post('/students/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Add these functions to your existing student.service.js

/**
 * Get all students (alias for getAllStudents for compatibility)
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of students
 */
export const getStudents = async (params = {}) => {
  return getAllStudents(params);
};

/**
 * Export students to Excel/CSV
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Blob>} - File blob for download
 */
export const exportStudents = async (filters = {}) => {
  try {
    const response = await api.get('/students/export', { 
      params: filters,
      responseType: 'blob' 
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Download student import template
 * @returns {Promise<Blob>} - Template file blob
 */
export const downloadStudentTemplate = async () => {
  try {
    const response = await api.get('/students/template', { 
      responseType: 'blob' 
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload students (alias for uploadStudentCSV for compatibility)
 * @param {File} file - CSV/Excel file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload results
 */
export const uploadStudents = async (file, options = {}) => {
  return uploadStudentCSV(file, options);
};
