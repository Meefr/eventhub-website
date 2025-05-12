import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from './Button';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('notfound.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('notfound.message')}
        </p>
        <Link to="/">
          <Button>
            {t('notfound.go_home')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;