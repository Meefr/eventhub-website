import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Button from "../common/Button";

const Navbar = () => {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  // Safely handle languages object
  const languages = {
    en: "English",
    ar: "العربية",
  };

  return (
    <header
      className={`${
        darkMode ? "bg-tabledark text-light" : "bg-light text-dark"
      }  shadow-sm`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className={`text-xl font-extrabold ${
              darkMode ? "text-light" : "text-dark"
            }`}
          >
            EventHub
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? `bg-hoverColor text-dark`
                      : `${
                          darkMode ? "text-light" : "text-dark hover:text-light"
                        } hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`
                }
              >
                {t("common.home")}
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? `bg-hoverColor text-dark`
                          : `${
                              darkMode
                                ? "text-light"
                                : "text-dark hover:text-light"
                            } hover:bg-gray-100 dark:hover:bg-gray-700`
                      }`
                    }
                  >
                    {t("common.bookings")}
                  </NavLink>

                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin/events"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? `bg-hoverColor text-dark`
                            : `${
                                darkMode
                                  ? "text-light"
                                  : "text-dark hover:text-light"
                              } hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`
                      }
                    >
                      {t("common.admin")}
                    </NavLink>
                  )}
                </>
              )}
            </nav>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className={` ${
                  darkMode ? "bg-tabledark text-light" : "text-dark bg-light"
                } border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm`}
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className={`text-sm font-medium ${darkMode? 'text-light' : 'text-dark'} hover:text-hoverColor `}
                  >
                    {user?.name}
                  </Link>
                  <Button size="sm" variant="outline" onClick={logout}>
                    {t("common.logout")}
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button size="sm" variant="outline">
                      {t("common.login")}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">{t("common.register")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
