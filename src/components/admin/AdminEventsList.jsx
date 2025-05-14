import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteEvent, getEvents } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Table from '../common/Table';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const AdminEventsList = () => {
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
        console.log("events",data);
        
        setEvents(data.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(t('admin.events.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user.id, t]);

  const handleCreate = () => {
    navigate('/admin/events/new');
  };
  const handleDelete = async (id) => {
    if (window.confirm(t('admin.events.delete_confirm'))) {
      try {
        setLoading(true);
        console.log(events);
        
        await deleteEvent(id);

        await setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
        setError(`${t('admin.events.delete_error')} -- ${error.response?.data?.error}`);
      } finally {
        setLoading(false);
      }
    }
  }
  const handleEdit = (id) => {
    navigate(`/admin/events/${id}/edit`);
  };

  const columns = [
    { header: t('admin.events.title'), accessor: 'title' },
    { header: t('admin.events.date'), accessor: 'date', format: (value) => new Date(value).toLocaleDateString() },
    { header: t('admin.events.location'), accessor: 'location' },
    { 
      header: t('admin.events.status'), 
      accessor: 'isPublished', 
      format: (value) => value ? t('admin.events.published') : t('admin.events.draft') 
    },
    {
      header: t('admin.events.actions'),
      accessor: '_id',
      render: (id) => (
        <div className="space-x-2">
          <Button 
            size="sm" 
            onClick={() => handleEdit(id)}
          >
            {t('common.edit')}
          </Button>
        </div>
      )
    },{
      header: t('admin.events.actions'),
      accessor: '_id',
      render: (id) => (
        <div className="space-x-2">
          <Button 
            size="sm" 
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleDelete(id)}
          >
            {t('common.delete')}
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
        <h1 className="text-2xl font-bold">{t('admin.events.title')}</h1>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleCreate}>
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

export default AdminEventsList;