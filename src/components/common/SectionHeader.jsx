import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

const SectionHeader = ({ title, subtitle = '', className = '' }) => {
  const { t } = useTranslation();
  const {darkMode} = useTheme();
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className={`text-2xl font-bold`}>
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