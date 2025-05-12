import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from './common/Button';

const Congratulations = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
          {t('bookings.congratulations')}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t('bookings.success_message')}
        </p>
        <div className="mt-6">
          <Link to="/bookings">
            <Button className="w-full">
              {t('bookings.view_bookings')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Congratulations;