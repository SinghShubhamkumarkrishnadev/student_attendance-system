import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createClass, getClassById, updateClass } from '../../services/class.service';

const ClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    classId: '',
    className: '',
    division: '',
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchClassData = async () => {
      if (isEditMode) {
        try {
          setIsLoading(true);
          const classData = await getClassById(id);
          setInitialValues({
            classId: classData.classId || '',
            className: classData.className || '',
            division: classData.division || '',
          });
        } catch (error) {
          toast.error('Failed to fetch class data');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClassData();
  }, [id, isEditMode]);

  const validationSchema = Yup.object({
    classId: Yup.string().required('Class ID is required'),
    className: Yup.string().required('Class name is required'),
    division: Yup.string().required('Division is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateClass(id, values);
        toast.success('Class updated successfully');
      } else {
        await createClass(values);
        toast.success('Class created successfully');
      }
      navigate('/classes');
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Class' : 'Create New Class'}
      </h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="classId" className="block text-gray-700 font-medium mb-2">
                Class ID
              </label>
              <Field
                type="text"
                id="classId"
                name="classId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CS101"
              />
              <ErrorMessage name="classId" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="className" className="block text-gray-700 font-medium mb-2">
                Class Name
              </label>
              <Field
                type="text"
                id="className"
                name="className"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Computer Science"
              />
              <ErrorMessage name="className" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-6">
              <label htmlFor="division" className="block text-gray-700 font-medium mb-2">
                Division
              </label>
              <Field
                type="text"
                id="division"
                name="division"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., A"
              />
              <ErrorMessage name="division" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Class' : 'Create Class'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ClassForm;
