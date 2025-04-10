import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getProfessors, deleteProfessor, resetProfessorPassword } from '../../services/professor.service';
import Modal from '../common/Modal';

const ProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState(null);
  const [professorToResetPassword, setProfessorToResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProfessors(professors);
    } else {
      const filtered = professors.filter(
        (professor) =>
          professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          professor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfessors(filtered);
    }
  }, [searchTerm, professors]);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const data = await getProfessors();
      setProfessors(data);
      setFilteredProfessors(data);
    } catch (error) {
      toast.error('Failed to fetch professors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (professor) => {
    setProfessorToDelete(professor);
    setShowDeleteModal(true);
  };

  const handleResetPasswordClick = (professor) => {
    setProfessorToResetPassword(professor);
    setNewPassword('');
    setShowNewPassword(false);
    setShowResetPasswordModal(true);
  };

  const confirmDelete = async () => {
    if (!professorToDelete) return;
    
    try {
      await deleteProfessor(professorToDelete._id);
      toast.success('Professor deleted successfully');
      fetchProfessors();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete professor');
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setProfessorToDelete(null);
    }
  };

  const confirmResetPassword = async () => {
    if (!professorToResetPassword) return;
    
    try {
      const response = await resetProfessorPassword(professorToResetPassword._id);
      setNewPassword(response.newPassword);
      setShowNewPassword(true);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
      console.error(error);
      setShowResetPasswordModal(false);
      setProfessorToResetPassword(null);
    }
  };

  const closeResetPasswordModal = () => {
    setShowResetPasswordModal(false);
    setProfessorToResetPassword(null);
    setNewPassword('');
    setShowNewPassword(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Professors</h1>
        <Link
          to="/professors/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Add New Professor
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search professors by name or email..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProfessors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No professors found. {searchTerm ? 'Try a different search term.' : 'Add your first professor!'}</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Classes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfessors.map((professor) => (
                <tr key={professor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{professor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{professor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {professor.classes && professor.classes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {professor.classes.slice(0, 3).map((classItem, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {classItem.className} {classItem.division}
                            </span>
                          ))}
                          {professor.classes.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{professor.classes.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No classes assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/professors/${professor._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/professors/edit/${professor._id}`}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleResetPasswordClick(professor)}
                        className="text-green-600 hover:text-green-900"
                        title="Reset Password"
                      >
                        <FaKey />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(professor)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to delete professor "{professorToDelete?.name}"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={showResetPasswordModal}
        onClose={closeResetPasswordModal}
        title="Reset Password"
      >
        <div className="p-6">
          {!showNewPassword ? (
            <>
              <p className="mb-4">
                Are you sure you want to reset the password for professor "{professorToResetPassword?.name}"?
              </p>
              <p className="mb-4 text-sm text-gray-600">
                This will generate a new random password. The professor will need to change it after logging in.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeResetPasswordModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResetPassword}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Reset Password
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4">
                Password has been reset for professor "{professorToResetPassword?.name}".
              </p>
              <div className="mb-6 p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium text-gray-700">New Password:</p>
                <div className="mt-1 flex items-center">
                  <input
                    type="text"
                    value={newPassword}
                    readOnly
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newPassword);
                      toast.success('Password copied to clipboard');
                    }}
                    className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-xs text-red-600">
                  Please make note of this password. It will not be shown again.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeResetPasswordModal}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProfessorList;
