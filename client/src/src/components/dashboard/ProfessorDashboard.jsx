import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUsers, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getProfessorClasses } from '../../services/professor.service';

const ProfessorDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const classesData = await getProfessorClasses();
        setClasses(classesData);
      } catch (error) {
        toast.error('Failed to load assigned classes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Professor {user?.name || ''}</h1>
        <p className="text-gray-600">Manage your classes and attendance</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
            <FaChalkboardTeacher size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">Assigned Classes</p>
            <p className="text-2xl font-semibold">{classes.length}</p>
          </div>
        </div>
      </div>

      {/* Assigned Classes */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Classes</h2>
      
      {classes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">You don't have any assigned classes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {classItem.className} - {classItem.division}
                </h3>
                <p className="text-gray-600 mb-4">Class ID: {classItem.classId}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaUsers className="mr-2" />
                  <span>{classItem.students?.length || 0} Students</span>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Link 
                    to={`/attendance/mark/${classItem._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    <FaClipboardList className="mr-2" />
                    Mark Attendance
                  </Link>
                  
                  <Link 
                    to={`/attendance/view/${classItem._id}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
                  >
                    View Records
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
