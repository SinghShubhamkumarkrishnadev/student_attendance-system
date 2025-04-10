import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaKey, FaUserGraduate, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStudentById, resetStudentPassword } from '../../services/student.service';
import { getStudentAttendance } from '../../services/attendance.service';
import Modal from '../common/Modal';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceData, setAttendanceData] = useState(null);
    const [attendanceLoading, setAttendanceLoading] = useState(true);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const data = await getStudentById(id);
            setStudent(data);

            // After getting student data, fetch attendance
            fetchAttendanceData(data._id);
        } catch (error) {
            toast.error('Failed to fetch student details');
            console.error(error);
            navigate('/students');
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceData = async (studentId) => {
        try {
            setAttendanceLoading(true);
            const data = await getStudentAttendance(studentId);
            setAttendanceData(data);
        } catch (error) {
            console.error('Failed to fetch attendance data', error);
            // Don't show toast for attendance errors to avoid overwhelming the user
        } finally {
            setAttendanceLoading(false);
        }
    };

    const handleResetPasswordClick = () => {
        setNewPassword('');
        setShowNewPassword(false);
        setShowResetPasswordModal(true);
    };

    const confirmResetPassword = async () => {
        try {
            const response = await resetStudentPassword(id);
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

    // Calculate attendance statistics
    const calculateAttendanceStats = () => {
        if (!attendanceData || !attendanceData.records || attendanceData.records.length === 0) {
            return { present: 0, absent: 0, total: 0, percentage: 0 };
        }

        const total = attendanceData.records.length;
        const present = attendanceData.records.filter(record => record.status === 'present').length;
        const absent = total - present;
        const percentage = Math.round((present / total) * 100);

        return { present, absent, total, percentage };
    };

    const attendanceStats = calculateAttendanceStats();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center p-6">
                <p className="text-red-500">Student not found</p>
                <Link to="/students" className="text-blue-500 hover:underline mt-2 inline-block">
                    Back to Students
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link to="/students" className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaArrowLeft className="mr-2" />
                    Back to Students
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{student.name}</h1>
                            <p className="text-gray-600 mb-1">Roll No: {student.rollNo}</p>
                            <p className="text-gray-600">{student.email}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Link
                                to={`/students/edit/${id}`}
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

                {/* Student Information Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaUserGraduate className="mr-2 text-blue-600" />
                            Student Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Class</p>
                                <p className="font-medium">
                                    {student.class ? (
                                        `${student.class.className} - ${student.class.division} (${student.class.classId})`
                                    ) : (
                                        <span className="text-gray-400">Not assigned</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="font-medium">{student.gender || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium">
                                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{student.phone || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{student.address || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaChartBar className="mr-2 text-blue-600" />
                            Attendance Summary
                        </h2>

                        {attendanceLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : attendanceData && attendanceData.records && attendanceData.records.length > 0 ? (
                            <div>
                                <div className="flex justify-between mb-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Total Classes</p>
                                        <p className="text-xl font-bold text-blue-700">{attendanceStats.total}</p>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Present</p>
                                        <p className="text-xl font-bold text-green-700">{attendanceStats.present}</p>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Absent</p>
                                        <p className="text-xl font-bold text-red-700">{attendanceStats.absent}</p>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Attendance Rate</span>
                                        <span className="font-medium">{attendanceStats.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${attendanceStats.percentage >= 75 ? 'bg-green-600' :
                                                    attendanceStats.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-600'
                                                }`}
                                            style={{ width: `${attendanceStats.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        to={`/attendance/student/${student._id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View detailed attendance →
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 text-gray-500">
                                <p>No attendance records found for this student.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Attendance Section */}
                <div className="p-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-600" />
                        Recent Attendance
                    </h2>

                    {attendanceLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : attendanceData && attendanceData.records && attendanceData.records.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Marked By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceData.records.slice(0, 5).map((record) => (
                                        <tr key={record._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.subject?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'present'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {record.status === 'present' ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.markedBy?.name || 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {attendanceData.records.length > 5 && (
                                <div className="mt-4 text-center">
                                    <Link
                                        to={`/attendance/student/${student._id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View all {attendanceData.records.length} attendance records
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-6 text-gray-500">
                            <p>No attendance records found for this student.</p>
                        </div>
                    )}
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
                                Are you sure you want to reset the password for student "{student.name}"?
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
                                Password has been reset for student "{student.name}".
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

export default StudentDetails;
