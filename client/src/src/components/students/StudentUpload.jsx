import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileExcel, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadStudents, downloadStudentTemplate } from '../../services/student.service';
import { getClasses } from '../../services/class.service';

const StudentUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const classesData = await getClasses();
      setClasses(classesData);
    } catch (error) {
      toast.error('Failed to fetch classes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check if file is Excel
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      e.target.value = null;
      setFile(null);
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      e.target.value = null;
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadStudentTemplate();
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', selectedClass);
      
      // Upload with progress tracking
      const result = await uploadStudents(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      
      setUploadResults(result);
      toast.success(`Upload completed: ${result.successCount} students added successfully`);
      
      // Reset file input
      setFile(null);
      document.getElementById('file-upload').value = '';
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload students');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Back to Students
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Bulk Upload Students</h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h2>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Download the template Excel file below</li>
            <li>Fill in student details according to the template format</li>
            <li>Select the class to which you want to add these students</li>
            <li>Upload the completed Excel file</li>
            <li>Supported file formats: .xlsx, .xls (max 5MB)</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={loading}
          >
            <FaDownload className="mr-2" />
            Download Template
          </button>
        </div>
        
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label htmlFor="class-select" className="block text-gray-700 font-medium mb-2">
              Select Class
            </label>
            <select
              id="class-select"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedClass}
              onChange={handleClassChange}
              disabled={loading || isUploading}
              required
            >
              <option value="">-- Select a class --</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.className} - {classItem.division} ({classItem.classId})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="file-upload" className="block text-gray-700 font-medium mb-2">
              Upload Excel File
            </label>
            <div className="flex items-center">
              <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50">
                <FaFileExcel className="mr-2 text-green-600" />
                <span className="text-gray-600">
                  {file ? file.name : 'Choose file...'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            {file && (
              <p className="mt-1 text-sm text-gray-500">
                File size: {(file.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
          
          {isUploading && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!file || !selectedClass || isUploading}
            >
              <FaUpload className="mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Students'}
            </button>
          </div>
        </form>
        
        {/* Upload Results */}
        {uploadResults && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-lg font-medium text-green-800">{uploadResults.successCount}</p>
                <p className="text-sm text-green-600">Students added successfully</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-lg font-medium text-yellow-800">{uploadResults.updatedCount}</p>
                <p className="text-sm text-yellow-600">Students updated</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-lg font-medium text-red-800">{uploadResults.errorCount}</p>
                <p className="text-sm text-red-600">Errors encountered</p>
              </div>
            </div>
            
            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-red-700">Error Details</h3>
                <div className="max-h-60 overflow-y-auto bg-red-50 p-3 rounded-md border border-red-200">
                  <ul className="list-disc pl-5 space-y-1">
                    {uploadResults.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate('/students')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Students List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentUpload;
