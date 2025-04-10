import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaUpload, FaFileExport, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStudents, deleteStudent, exportStudents, resetStudentPassword } from '../../services/student.service';
import Modal from '../common/Modal';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToResetPassword, setStudentToResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleResetPasswordClick = (student) => {
    setStudentToResetPassword(student);
    setNewPassword('');
    setShowNewPassword(false);
    setShowResetPasswordModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      await deleteStudent(studentToDelete._id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete student');
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const confirmResetPassword = async () => {
    if (!studentToResetPassword) return;
    
    try {
      const response = await resetStudentPassword(studentToResetPassword._id);
      setNewPassword(response.newPassword);
      setShowNewPassword(true);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
      console.error(error);
      setShowResetPasswordModal(false);
      setStudentToResetPassword(null);
    }
  };

  const closeResetPasswordModal = () => {
    setShowResetPasswordModal(false);
    setStudentToResetPassword(null);
    setNewPassword('');
    setShowNewPassword(false);
  };

  const handleExportStudents = async () => {
    try {
      setExportLoading(true);
      await exportStudents();
      toast.success('Students exported successfully');
    } catch (error) {
      toast.error('Failed to export students');
      console.error(error);
    } finally {
      setExportLoading(false);
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/students/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Add Student
          </Link>
          <Link
            to="/students/upload"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaUpload className="mr-2" />
            Bulk Upload
          </Link>
          <button
            onClick={handleExportStudents}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            disabled={exportLoading}
          >
            <FaFileExport className="mr-2" />
            {exportLoading ? 'Exporting...' : 'Export All'}
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search students by name, email, or roll number..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No students found. {searchTerm ? 'Try a different search term.' : 'Add your first student!'}</p>
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.rollNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.class ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {student.class.className} {student.class.division}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/students/${student._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/students/edit/${student._id}`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleResetPasswordClick(student)}
                          className="text-green-600 hover:text-green-900"
                          title="Reset Password"
                        >
                          <FaKey />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
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
            Are you sure you want to delete student "{studentToDelete?.name}" with roll number {studentToDelete?.rollNo}?
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
                Are you sure you want to reset the password for student "{studentToResetPassword?.name}" with roll number {studentToResetPassword?.rollNo}?
              </p>
              <p className="mb-4 text-sm text-gray-600">
                This will generate a new random password. The student will need to change it after logging in.
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
                Password has been reset for student "{studentToResetPassword?.name}".
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

export default StudentList;
