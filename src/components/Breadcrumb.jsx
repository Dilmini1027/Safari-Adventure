import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumb = ({ customPaths = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Default path mappings
  const defaultPaths = {
    '': 'Home',
    'dashboard': 'Dashboard',
    'admin': 'Admin',
    'visitor': 'Visitor',
    'book-safari': 'Book Safari',
    'destinations': 'Destinations',
    'visitors': 'Visitor Management',
    'booking': 'Booking',
    'login': 'Login',
    'register': 'Register'
  };

  // Merge custom paths with default paths
  const pathMappings = { ...defaultPaths, ...customPaths };

  const getBreadcrumbName = (path) => {
    return pathMappings[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const isClickable = (index) => {
    // Make all breadcrumb items clickable except the last one (current page)
    return index < pathnames.length - 1;
  };

  const buildPath = (index) => {
    return '/' + pathnames.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      {/* Home breadcrumb */}
      <Link 
        to="/" 
        className="flex items-center text-gray-500 hover:text-green-600 transition-colors duration-200"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Home
      </Link>

      {pathnames.length > 0 && (
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      )}

      {/* Dynamic breadcrumbs */}
      {pathnames.map((path, index) => {
        const isLast = index === pathnames.length - 1;
        const fullPath = buildPath(index);
        const breadcrumbName = getBreadcrumbName(path);

        return (
          <React.Fragment key={path}>
            {isClickable(index) ? (
              <Link
                to={fullPath}
                className="text-gray-500 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                {breadcrumbName}
              </Link>
            ) : (
              <span className="text-green-600 font-semibold">
                {breadcrumbName}
              </span>
            )}
            
            {!isLast && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;