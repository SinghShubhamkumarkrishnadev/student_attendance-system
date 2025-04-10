import api from './api';

/**
 * Get all professors with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of professors
 */
export const getAllProfessors = async (params = {}) => {
  try {
    const response = await api.get('/professors', { params });
    return response.professors;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a professor by ID
 * @param {string} id - Professor ID
 * @returns {Promise<Object>} - Professor data
 */
export const getProfessorById = async (id) => {
  try {
    const response = await api.get(`/professors/${id}`);
    return response.professor;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new professor
 * @param {Object} professorData - Professor data
 * @returns {Promise<Object>} - Created professor data
 */
export const createProfessor = async (professorData) => {
  try {
    const response = await api.post('/professors', professorData);
    return response.professor;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a professor
 * @param {string} id - Professor ID
 * @param {Object} professorData - Updated professor data
 * @returns {Promise<Object>} - Updated professor data
 */
export const updateProfessor = async (id, professorData) => {
  try {
    const response = await api.put(`/professors/${id}`, professorData);
    return response.professor;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a professor
 * @param {string} id - Professor ID
 * @returns {Promise<Object>} - Response data
 */
export const deleteProfessor = async (id) => {
  try {
    const response = await api.delete(`/professors/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get classes assigned to a professor
 * @param {string} id - Professor ID
 * @returns {Promise<Array>} - List of classes
 */
export const getProfessorClasses = async () => {
  try {
    const response = await api.get(`/professors/classes`);
    return response.classes;
  } catch (error) {
    throw error;
  }
};

/**
 * Assign classes to a professor
 * @param {string} id - Professor ID
 * @param {Array} classIds - Array of class IDs to assign
 * @returns {Promise<Object>} - Response data
 */
export const assignClassesToProfessor = async (id, classIds) => {
  try {
    const response = await api.post(`/professors/${id}/classes`, { classIds });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove a class assignment from a professor
 * @param {string} professorId - Professor ID
 * @param {string} classId - Class ID
 * @returns {Promise<Object>} - Response data
 */
export const removeClassFromProfessor = async (professorId, classId) => {
  try {
    const response = await api.delete(`/professors/${professorId}/classes/${classId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get professor's schedule
 * @param {string} id - Professor ID
 * @returns {Promise<Array>} - Professor's schedule
 */
export const getProfessorSchedule = async (id) => {
  try {
    const response = await api.get(`/professors/${id}/schedule`);
    return response.schedule;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset professor's password
 * @param {string} id - Professor ID
 * @returns {Promise<Object>} - Response with new password
 */
export const resetProfessorPassword = async (id) => {
    try {
      const response = await api.post(`/professors/${id}/reset-password`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Get attendance records managed by a professor
   * @param {string} id - Professor ID
   * @param {Object} params - Query parameters (date range, class, etc.)
   * @returns {Promise<Array>} - List of attendance records
   */
  export const getProfessorAttendanceRecords = async (id, params = {}) => {
    try {
      const response = await api.get(`/professors/${id}/attendance`, { params });
      return response.attendance;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Get professor statistics
   * @param {string} id - Professor ID
   * @param {Object} params - Query parameters (date range, etc.)
   * @returns {Promise<Object>} - Professor statistics
   */
  export const getProfessorStats = async (id, params = {}) => {
    try {
      const response = await api.get(`/professors/${id}/stats`, { params });
      return response.stats;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Upload professor profile image
   * @param {string} id - Professor ID
   * @param {File} imageFile - Image file to upload
   * @returns {Promise<Object>} - Response with image URL
   */
  export const uploadProfessorImage = async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Use axios directly to handle multipart/form-data
      const response = await api.post(`/professors/${id}/image`, formData, {
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
   * Get professor by email
   * @param {string} email - Professor email
   * @returns {Promise<Object>} - Professor data
   */
  export const getProfessorByEmail = async (email) => {
    try {
      const response = await api.get(`/professors/email/${email}`);
      return response.professor;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Bulk import professors
   * @param {Array} professorsData - Array of professor data objects
   * @returns {Promise<Object>} - Import results
   */
  export const bulkImportProfessors = async (professorsData) => {
    try {
      const response = await api.post('/professors/bulk-import', { professors: professorsData });
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  // Add these functions to your existing professor.service.js

/**
 * Get all professors (alias for getAllProfessors for compatibility)
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of professors
 */
export const getProfessors = async (params = {}) => {
  return getAllProfessors(params);
};
