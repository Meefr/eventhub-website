import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { LANGUAGES } from '../../config';

const Layout = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        language={language}
        changeLanguage={changeLanguage}
        languages={LANGUAGES}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;