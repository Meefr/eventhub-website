import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../services/authService';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const {darkMode} = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await login(formData);
      authLogin(data.user, data.token);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || t('auth.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };
  console.log("Login darkMode",darkMode);
  
  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 `}>
      <div className={`max-w-md w-full space-y-8 ${darkMode ? 'bg-tabledark text-light':'bg-light text-dark'} p-8 rounded-lg shadow-lg`}>
        <div className="text-center">
          <h2 className={`mt-6 text-3xl font-extrabold ${darkMode ? 'text-light' : 'text-dark'}`}>
            {t('auth.login_title')}
          </h2>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <FormInput
              label={t('auth.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            
            <FormInput
              label={t('auth.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                to="/register" 
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {t('auth.no_account')}
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {t('common.login')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;