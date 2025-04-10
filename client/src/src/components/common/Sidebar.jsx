import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUserTie, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaBook, 
  FaCalendarAlt, 
  FaChartBar, 
  FaCog, 
  FaChevronDown, 
  FaChevronRight 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ closeMobileMenu }) => {
  const location = useLocation();
  const { userRole } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    students: false,
    professors: false,
    classes: false,
    attendance: false,
    reports: false,
    settings: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu]
    });
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Check if user has permission for a specific route
  const hasPermission = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(userRole);
  };

  // Define sidebar menu items with their permissions
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FaTachometerAlt />,
      roles: ['admin', 'professor', 'student']
    },
    {
      name: 'Professors',
      path: '/professors',
      icon: <FaUserTie />,
      roles: ['admin'],
      submenu: [
        { name: 'All Professors', path: '/professors' },
        { name: 'Add Professor', path: '/professors/new' }
      ]
    },
    {
      name: 'Students',
      path: '/students',
      icon: <FaUserGraduate />,
      roles: ['admin', 'professor'],
      submenu: [
        { name: 'All Students', path: '/students' },
        { name: 'Add Student', path: '/students/new' },
        { name: 'Bulk Upload', path: '/students/upload' }
      ]
    },
    {
      name: 'Classes',
      path: '/classes',
      icon: <FaChalkboardTeacher />,
      roles: ['admin', 'professor'],
      submenu: [
        { name: 'All Classes', path: '/classes' },
        { name: 'Add Class', path: '/classes/new' }
      ]
    },
    {
      name: 'Subjects',
      path: '/subjects',
      icon: <FaBook />,
      roles: ['admin', 'professor'],
      submenu: [
        { name: 'All Subjects', path: '/subjects' },
        { name: 'Add Subject', path: '/subjects/new' }
      ]
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: <FaCalendarAlt />,
      roles: ['admin', 'professor', 'student'],
      submenu: [
        { name: 'Take Attendance', path: '/attendance/take', roles: ['admin', 'professor'] },
        { name: 'View Attendance', path: '/attendance/view' },
        { name: 'My Attendance', path: '/attendance/my', roles: ['student'] }
      ]
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <FaChartBar />,
      roles: ['admin', 'professor'],
      submenu: [
        { name: 'Attendance Reports', path: '/reports/attendance' },
        { name: 'Student Reports', path: '/reports/students' },
        { name: 'Class Reports', path: '/reports/classes' }
      ]
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <FaCog />,
      roles: ['admin'],
      submenu: [
        { name: 'General Settings', path: '/settings/general' },
        { name: 'Attendance Settings', path: '/settings/attendance' },
        { name: 'User Management', path: '/settings/users' }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">AttendEase</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Skip items the user doesn't have permission for
            if (!hasPermission(item.roles)) return null;

            return (
              <li key={item.path}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name.toLowerCase())}
                      className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="flex-1">{item.name}</span>
                      {expandedMenus[item.name.toLowerCase()] ? (
                        <FaChevronDown className="ml-2" />
                      ) : (
                        <FaChevronRight className="ml-2" />
                      )}
                    </button>
                    {expandedMenus[item.name.toLowerCase()] && (
                      <ul className="mt-1 pl-8 space-y-1">
                        {item.submenu.map((subItem) => {
                          // Skip submenu items the user doesn't have permission for
                          if (subItem.roles && !hasPermission(subItem.roles)) return null;

                          return (
                            <li key={subItem.path}>
                              <NavLink
                                to={subItem.path}
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                  `block px-4 py-2 text-sm rounded-md ${
                                    isActive
                                      ? 'bg-gray-700 text-white'
                                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                  }`
                                }
                              >
                                {subItem.name}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

