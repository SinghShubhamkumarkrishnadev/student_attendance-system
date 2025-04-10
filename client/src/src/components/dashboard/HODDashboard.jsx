import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserTie, FaUsers, FaChalkboardTeacher, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getHODProfile } from '../../services/auth.service';
import { getClasses } from '../../services/class.service';
import { getProfessors } from '../../services/professor.service';
import { getStudents } from '../../services/student.service';

const HODDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    classes: 0,
    professors: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch HOD profile
        const profileData = await getHODProfile();
        setProfile(profileData);
        
        // Fetch stats
        const [classesData, professorsData, studentsData] = await Promise.all([
          getClasses(),
          getProfessors(),
          getStudents(),
        ]);
        
        setStats({
          classes: classesData.length || 0,
          professors: professorsData.length || 0,
          students: studentsData.length || 0,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {profile?.username || 'HOD'}</h1>
        <p className="text-gray-600">{profile?.collegeName || 'College'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaChalkboardTeacher size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Classes</p>
              <p className="text-2xl font-semibold">{stats.classes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaUserTie size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Professors</p>
              <p className="text-2xl font-semibold">{stats.professors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Students</p>
              <p className="text-2xl font-semibold">{stats.students}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/classes/new" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mb-4">
              <FaChalkboardTeacher size={24} />
            </div>
            <p className="text-gray-800 font-medium">Add New Class</p>
          </div>
        </Link>

        <Link to="/professors/new" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mb-4">
              <FaUserTie size={24} />
            </div>
            <p className="text-gray-800 font-medium">Add New Professor</p>
          </div>
        </Link>

        <Link to="/students/upload" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mb-4">
              <FaUpload size={24} />
            </div>
            <p className="text-gray-800 font-medium">Upload Students</p>
          </div>
        </Link>

        <Link to="/classes" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mb-4">
              <FaUsers size={24} />
            </div>
            <p className="text-gray-800 font-medium">Manage Classes</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HODDashboard;
