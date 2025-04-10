import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaKey, FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getProfessorById, resetProfessorPassword } from '../../services/professor.service';
import Modal from '../common/Modal';

const ProfessorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfessorData();
  }, [id]);

  const fetchProfessorData = async () => {
    try {
      setLoading(true);
      const data = await getProfessorById(id);
      setProfessor(data);
    } catch (error) {
      toast.error('Failed to fetch professor details');
      console.error(error);
      navigate('/professors');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordClick = () => {
    setNewPassword('');
    setShowNewPassword(false);
    setShowResetPasswordModal(true);
  };

  const confirmResetPassword = async () => {
    try {
      const response = await resetProfessorPassword(id);
      setNewPassword(response.newPassword);
      setShowNewPassword(true);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
      console.error(error);
      setShowResetPasswordModal(false);
    }
  };

  const closeResetPasswordModal = () => {
    setShowResetPasswordModal(false);
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

  if (!professor) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Professor not found</p>
        <Link to="/professors" className="text-blue-500 hover:underline mt-2 inline-block">
          Back to Professors
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link to="/professors" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Back to Professors
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{professor.name}</h1>
              <p className="text-gray-600">{professor.email}</p>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/professors/edit/${id}`}
                className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                <FaEdit className="mr-1" />
                Edit
              </Link>
              <button
                onClick={handleResetPasswordClick}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FaKey className="mr-1" />
                Reset Password
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Classes Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaChalkboardTeacher className="mr-2" />
            Assigned Classes
          </h2>

          {professor.classes && professor.classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professor.classes.map((classItem) => (
                <div key={classItem._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {classItem.className} - {classItem.division}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Class ID: {classItem.classId}</p>
                  <p className="text-sm text-gray-500">
                    {classItem.students?.length || 0} Students
                  </p>
                  <div className="mt-3">
                    <Link
                      to={`/classes/${classItem._id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Class Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">No classes assigned to this professor yet.</p>
              <Link
                to={`/professors/edit/${id}`}
                className="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Assign Classes
              </Link>
            </div>
          )}
        </div>

        {/* Attendance Statistics Section (can be expanded in the future) */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Statistics</h2>
          <p className="text-gray-600">
            Detailed attendance statistics will be available here in the future.
          </p>
        </div>
      </div>

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
                Are you sure you want to reset the password for professor "{professor.name}"?
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
                Password has been reset for professor "{professor.name}".
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

export default ProfessorDetails;
