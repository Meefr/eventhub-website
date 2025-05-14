import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AdminPanel = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const {darkMode} = useTheme();
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 lg:w-1/5">
          <div className={`${darkMode?'bg-secondry text-light':'bg-light text-dark'}rounded-lg shadow-md overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">{t('admin.dashboard')}</h2>
            </div>
            <nav className="p-2">
              <Link
                to="/admin/events"
                className={`block px-4 py-2 rounded-md mb-1 ${
                  isActive('/admin/events')
                    ? `bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200`
                    : `${darkMode?'text-light':'text-dark'} hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-light`
                }`}
              >
                {t('admin.events.title')}
              </Link>
              <Link
                to="/admin/users"
                className={`block px-4 py-2 rounded-md ${
                  isActive('/admin/users')
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                    : `${darkMode?'text-light':'text-dark'} hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-light`
                }`}
              >
                {t('admin.users.title')}
              </Link>
               <Link
                to="/admin/categories"
                className={`block px-4 py-2 rounded-md ${
                  isActive('/admin/categories')
                    ? `bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200`
                    : `${darkMode?'text-light':'text-dark'} hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-light`
                }`}
              >
                {t('admin.categories.title')}
              </Link>
            </nav>
          </div>
        </div>
        <div className="md:w-3/4 lg:w-4/5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;