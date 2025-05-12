import { useTranslation } from 'react-i18next';

const SectionHeader = ({ title, subtitle = '', className = '' }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t(title)}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t(subtitle)}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;