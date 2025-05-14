import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../services/authService';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {darkMode} = useTheme();
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

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwords_mismatch'));
      setLoading(false);
      return;
    }

    try {
      const { data } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      authLogin(data.user, data.token);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      let message = error.response?.data?.error || t('auth.registration_error');
      if(Array.isArray(error.response?.data?.errors)) {
        message = error.response.data.errors.map(err => err.message).join(', ');
        console.log('Validation errors:', message);
        
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-md w-full space-y-8 ${darkMode?'bg-tabledark text-light':'bg-light text-dark'} p-8 rounded-lg shadow-lg`}>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold ">
            {t('auth.register_title')}
          </h2>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <FormInput
              label={t('auth.name')}
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            
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
              autoComplete="new-password"
            />
            
            <FormInput
              label={t('auth.confirm_password')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                to="/login" 
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {t('auth.have_account')}
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {t('common.register')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;