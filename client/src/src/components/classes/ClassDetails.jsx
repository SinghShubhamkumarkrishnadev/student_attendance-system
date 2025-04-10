import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaUserPlus, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getClassById, removeStudentFromClass, removeProfessorFromClass } from '../../services/class.service';
import Modal from '../common/Modal';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRemoveStudentModal, setShowRemoveStudentModal] = useState(false);
  const [showRemoveProfessorModal, setShowRemoveProfessorModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [professorToRemove, setProfessorToRemove] = useState(null);

  useEffect(() => {
    fetchClassData();
  }, [id]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const data = await getClassById(id);
      setClassData(data);
    } catch (error) {
      toast.error('Failed to fetch class details');
      console.error(error);
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudentClick = (student) => {
    setStudentToRemove(student);
    setShowRemoveStudentModal(true);
  };

  const handleRemoveProfessorClick = (professor) => {
    setProfessorToRemove(professor);
    setShowRemoveProfessorModal(true);
  };

  const confirmRemoveStudent = async () => {
    if (!studentToRemove) return;
    
    try {
      await removeStudentFromClass(id, studentToRemove._id);
      toast.success('Student removed from class successfully');
      fetchClassData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove student from class');
      console.error(error);
    } finally {
      setShowRemoveStudentModal(false);
      setStudentToRemove(null);
    }
  };

  const confirmRemoveProfessor = async () => {
    if (!professorToRemove) return;
    
    try {
      await removeProfessorFromClass(id, professorToRemove._id);
      toast.success('Professor removed from class successfully');
      fetchClassData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove professor from class');
      console.error(error);
    } finally {
      setShowRemoveProfessorModal(false);
      setProfessorToRemove(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Class not found</p>
        <Link to="/classes" className="text-blue-500 hover:underline mt-2 inline-block">
          Back to Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link to="/classes" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Back to Classes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {classData.className} - {classData.division}
            </h1>
            <p className="text-gray-600">Class ID: {classData.classId}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/classes/edit/${id}`}
              className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              <FaEdit className="mr-1" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Professors Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Assigned Professors</h2>
          <Link
            to={`/classes/${id}/add-professor`}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <FaUserTie className="mr-1" />
            Assign Professor
          </Link>
        </div>

        {classData.professors && classData.professors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classData.professors.map((professor) => (
                  <tr key={professor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{professor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{professor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveProfessorClick(professor)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No professors assigned to this class yet.</p>
        )}
      </div>

      {/* Students Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Enrolled Students</h2>
          <Link
            to={`/classes/${id}/add-student`}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaUserPlus className="mr-1" />
            Add Student
          </Link>
        </div>

        {classData.students && classData.students.length > 0 ? (
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classData.students.map((student) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveStudentClick(student)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No students enrolled in this class yet.</p>
        )}
      </div>

      {/* Remove Student Modal */}
      <Modal
        isOpen={showRemoveStudentModal}
        onClose={() => setShowRemoveStudentModal(false)}
        title="Remove Student"
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to remove <span className="font-semibold">{studentToRemove?.name}</span> from this class?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowRemoveStudentModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmRemoveStudent}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>

      {/* Remove Professor Modal */}
      <Modal
        isOpen={showRemoveProfessorModal}
        onClose={() => setShowRemoveProfessorModal(false)}
        title="Remove Professor"
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to remove <span className="font-semibold">{professorToRemove?.name}</span> from this class?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowRemoveProfessorModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmRemoveProfessor}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClassDetails;
