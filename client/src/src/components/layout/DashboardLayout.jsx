import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      setPageTitle('Dashboard');
    } else if (path.includes('/professors')) {
      setPageTitle('Professors');
    } else if (path.includes('/students')) {
      setPageTitle('Students');
    } else if (path.includes('/classes')) {
      setPageTitle('Classes');
    } else if (path.includes('/subjects')) {
      setPageTitle('Subjects');
    } else if (path.includes('/attendance')) {
      setPageTitle('Attendance');
    } else if (path.includes('/reports')) {
      setPageTitle('Reports');
    } else if (path.includes('/settings')) {
      setPageTitle('Settings');
    } else if (path.includes('/profile')) {
      setPageTitle('Profile');
    } else {
      setPageTitle('Dashboard');
    }
  }, [location]);

  // Close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
      console.error(error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}
      >
        <Sidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 focus:outline-none hidden md:block"
              >
                <FaBars className="h-5 w-5" />
              </button>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 focus:outline-none md:hidden"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">{pageTitle}</h1>
            </div>

            {/* Profile dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center text-gray-700 focus:outline-none"
              >
                <span className="mr-2 text-sm font-medium hidden sm:block">
                  {currentUser?.name || 'User'}
                </span>
                <div className="flex items-center">
                  <FaUserCircle className="h-8 w-8 text-gray-500" />
                  {isProfileDropdownOpen ? (
                    <FaChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <FaChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{currentUser?.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{currentUser?.email}</div>
                    <div className="text-gray-500 text-xs mt-1 capitalize">{userRole}</div>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUserCircle className="inline mr-2" /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-gray-800" onClick={(e) => e.stopPropagation()}>
              <Sidebar closeMobileMenu={toggleMobileMenu} />
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
