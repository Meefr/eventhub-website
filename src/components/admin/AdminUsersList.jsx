import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers } from '../../services/userService';
import Table from '../common/Table';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const AdminUsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(t('admin.users.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const columns = [
    { header: t('auth.name'), accessor: 'name' },
    { header: t('auth.email'), accessor: 'email' },
    { 
      header: t('auth.role'), 
      accessor: 'role',
      format: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    { 
      header: t('admin.users.status'), 
      accessor: 'isActive', 
      format: (value) => value ? t('admin.users.active') : t('admin.users.inactive') 
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
        data={users} 
        columns={columns} 
        emptyMessage={t('admin.users.no_users')}
      />
    </div>
  );
};

export default AdminUsersList;