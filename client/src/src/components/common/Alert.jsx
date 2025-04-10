import React from 'react';
import PropTypes from 'prop-types';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

/**
 * Alert component for displaying notifications
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type: 'info', 'success', 'warning', 'error'
 * @param {string} props.message - Alert message
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 * @param {function} props.onDismiss - Function to call when alert is dismissed
 * @returns {React.ReactNode} - The alert component
 */
const Alert = ({ type = 'info', message, dismissible = true, onDismiss }) => {
  // Define styles based on alert type
  const alertStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-700',
      icon: <FaInfoCircle className="h-5 w-5 text-blue-400" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: <FaCheckCircle className="h-5 w-5 text-green-400" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: <FaTimesCircle className="h-5 w-5 text-red-400" />,
    },
  };

  const style = alertStyles[type] || alertStyles.info;

  return (
    <div className={`rounded-md border ${style.bg} ${style.border} p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className={`ml-3 ${style.text}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${style.bg} ${style.text} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  message: PropTypes.string.isRequired,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
};

export default Alert;
