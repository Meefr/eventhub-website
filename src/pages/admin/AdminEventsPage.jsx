import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEvents } from '../../../services/eventService';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Alert from '../../../components/common/Alert';

const AdminEventsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await getEvents({ organizer: user.id });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(t('admin.events.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user.id, t]);

  const handleEdit = (id) => {
    navigate(`/admin/events/${id}/edit`);
  };

  const columns = [
    { header: t('admin.events.title'), accessor: 'title' },
    { header: t('admin.events.date'), accessor: 'date', format: (value) => new Date(value).toLocaleDateString() },
    { header: t('admin.events.location'), accessor: 'location' },
    { header: t('admin.events.status'), accessor: 'isPublished', format: (value) => value ? t('admin.events.published') : t('admin.events.draft') },
    {
      header: t('admin.events.actions'),
      accessor: '_id',
      render: (id) => (
        <div className="space-x-2">
          <Button size="sm" onClick={() => handleEdit(id)}>
            {t('common.edit')}
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.events.title')}</h1>
        <Button onClick={() => navigate('/admin/events/new')}>
          {t('admin.events.add_event')}
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table 
        data={events} 
        columns={columns} 
        emptyMessage={t('admin.events.no_events')}
      />
    </div>
  );
};

export default AdminEventsPage;