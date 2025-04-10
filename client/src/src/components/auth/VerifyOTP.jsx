import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { verifyOTP, resendOTP } from '../../services/auth.service';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  
  // Get email from location state or use empty string
  const email = location.state?.email || '';
  
  const initialValues = {
    email: email,
    otp: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    otp: Yup.string()
      .matches(/^\d{6}$/, 'OTP must be 6 digits')
      .required('OTP is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await verifyOTP(values.email, values.otp);
      
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email is required to resend OTP');
      return;
    }
    
    try {
      setIsResending(true);
      await resendOTP(email);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    readOnly={!!email}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="otp" className="sr-only">
                    OTP
                  </label>
                  <Field
                    id="otp"
                    name="otp"
                    type="text"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="6-digit OTP"
                  />
                  <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  {isResending ? 'Resending...' : 'Resend OTP'}
                </button>
                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Back to Login
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyOTP;
