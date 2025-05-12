import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEventCategories } from '../../services/eventService';
import Table from '../common/Table';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';
import i18n from '../../lang/i18n';
const currentLanguage = i18n.language || "en";
const AdminCategoriesList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories= async () => {
      try {
        setLoading(true);
        const { data } = await getEventCategories();
        console.log(data);
        
        setCategories(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(t('admin.users.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);
  console.log(currentLanguage);
  
  const columns = [
    {
      header: t('admin.categories.name'),
      accessor: 'displayName'
    },
    {
      header: t('admin.categories.slug'),
      accessor: 'slug'
    },
    {
      header: t('admin.categories.status'),
      accessor: 'isActive',
      format: (value) =>
        value ? t('admin.users.active') : t('admin.users.inactive')
    },
    {
      header: t('admin.categories.color'),
      accessor: 'color',
      format: (value) => (
        <span
          className="inline-block w-4 h-4 rounded-full"
          style={{ backgroundColor: value }}
          title={value}
        ></span>
      )
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('admin.users.title')}</h1>

      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')} 
        />
      )}

      <Table 
        data={categories} 
        columns={columns} 
        emptyMessage={t('admin.users.no_users')}
      />
    </div>
  );
};

export default AdminCategoriesList;