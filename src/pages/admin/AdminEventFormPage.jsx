import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEvent, createEvent, updateEvent } from '../../../services/eventService';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';
import FormInput from '../../../components/common/FormInput';
import FormTextarea from '../../../components/common/FormTextarea';
import FormSelect from '../../../components/common/FormSelect';

const AdminEventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: 0,
    availableTickets: 0,
    category: '',
    isFeatured: false,
    isPublished: false
  });

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const { data } = await getEvent(id);
          setEvent({
            title: data.title,
            description: data.description,
            date: data.date.split('T')[0],
            location: data.location,
            price: data.price,
            availableTickets: data.availableTickets,
            category: data.category?._id || '',
            isFeatured: data.isFeatured,
            isPublished: data.isPublished
          });
        } catch (error) {
          console.error('Error fetching event:', error);
          setError(t('admin.events.fetch_error'));
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const eventData = {
        ...event,
        organizer: user.id,
        price: Number(event.price),
        availableTickets: Number(event.availableTickets)
      };

      if (id) {
        await updateEvent(id, eventData);
        setSuccess(t('admin.events.update_success'));
      } else {
        await createEvent(eventData);
        setSuccess(t('admin.events.create_success'));
      }

      setTimeout(() => {
        navigate('/admin/events');
      }, 1500);
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.response?.data?.message || t('admin.events.save_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? t('admin.events.edit_event') : t('admin.events.add_event')}
      </h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <FormInput
          label={t('admin.events.title')}
          name="title"
          value={event.title}
          onChange={handleChange}
          required
        />

        <FormTextarea
          label={t('admin.events.description')}
          name="description"
          value={event.description}
          onChange={handleChange}
          required
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('admin.events.date')}
            name="date"
            type="date"
            value={event.date}
            onChange={handleChange}
            required
          />

          <FormInput
            label={t('admin.events.location')}
            name="location"
            value={event.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('admin.events.price')}
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={event.price}
            onChange={handleChange}
            required
          />

          <FormInput
            label={t('admin.events.available_tickets')}
            name="availableTickets"
            type="number"
            min="0"
            value={event.availableTickets}
            onChange={handleChange}
            required
          />
        </div>

        <FormSelect
          label={t('admin.events.category')}
          name="category"
          value={event.category}
          onChange={handleChange}
          options={[
            { value: 'music', label: t('categories.music') },
            { value: 'sports', label: t('categories.sports') },
            { value: 'art', label: t('categories.art') },
            { value: 'food', label: t('categories.food') }
          ]}
        />

        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={event.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('admin.events.featured')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={event.isPublished}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {t('admin.events.published')}
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/events')}
            disabled={submitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            loading={submitting}
          >
            {id ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventFormPage;