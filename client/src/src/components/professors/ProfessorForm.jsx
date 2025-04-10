import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createProfessor, getProfessorById, updateProfessor } from '../../services/professor.service';
import { getClasses } from '../../services/class.service';

const ProfessorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    classes: [],
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch available classes
        const classesData = await getClasses();
        setClasses(classesData);
        
        // If in edit mode, fetch professor data
        if (isEditMode) {
          const professorData = await getProfessorById(id);
          setInitialValues({
            name: professorData.name || '',
            email: professorData.email || '',
            password: '',
            confirmPassword: '',
            classes: professorData.classes?.map(c => c._id) || [],
          });
        }
      } catch (error) {
        toast.error('Failed to fetch data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .when('isEditMode', {
        is: false,
        then: schema => schema.required('Password is required'),
        otherwise: schema => schema
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .when('password', {
        is: val => val && val.length > 0,
        then: schema => schema.required('Confirm password is required'),
        otherwise: schema => schema
      }),
    classes: Yup.array()
      .of(Yup.string())
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...professorData } = values;
      
      // Only include password if it's provided (for edit mode)
      if (!professorData.password) {
        delete professorData.password;
      }
      
      if (isEditMode) {
        await updateProfessor(id, professorData);
        toast.success('Professor updated successfully');
      } else {
        await createProfessor(professorData);
        toast.success('Professor created successfully');
      }
      navigate('/professors');
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
        {isEditMode ? 'Edit Professor' : 'Add New Professor'}
      </h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Professor's full name"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="professor@example.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password {isEditMode && <span className="text-sm text-gray-500">(Leave blank to keep current password)</span>}
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm password"
                disabled={!values.password}
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Assign Classes
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <div key={classItem._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`class-${classItem._id}`}
                        checked={values.classes.includes(classItem._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldValue('classes', [...values.classes, classItem._id]);
                          } else {
                            setFieldValue(
                              'classes',
                              values.classes.filter((id) => id !== classItem._id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`class-${classItem._id}`} className="ml-2 block text-sm text-gray-900">
                        {classItem.className} - {classItem.division} ({classItem.classId})
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No classes available. Please create classes first.</p>
                )}
              </div>
              <ErrorMessage name="classes" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/professors')}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Professor' : 'Add Professor'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfessorForm;
