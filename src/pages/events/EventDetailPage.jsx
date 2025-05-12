import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEvent } from '../../services/eventService';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await getEvent(id);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(t('events.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]);

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setIsBooking(true);
      setError('');
      await createBooking({ event: id, ticketCount: 1 });
      setSuccess(t('bookings.success'));
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      console.error('Booking failed:', error);
      setError(error.response?.data?.message || t('bookings.error'));
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return <div className="text-center py-8">{t('events.not_found')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={event.image ? `/uploads/${event.image}` : './event-placeholder.jpg'} 
              alt={event.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          
          <div className="p-6 md:w-1/2">
            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="font-semibold">{t('events.date')}:</span> 
                <span> {new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold">{t('events.location')}:</span> 
                <span> {event.location}</span>
              </div>
              <div>
                <span className="font-semibold">{t('events.price')}:</span> 
                <span> ${event.price}</span>
              </div>
              <div>
                <span className="font-semibold">{t('events.available_tickets')}:</span> 
                <span> {event.availableTickets}</span>
              </div>
              <div>
                <span className="font-semibold">{t('events.category')}:</span> 
                <span> {event.category?.name}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleBookEvent}
              disabled={isBooking || event.availableTickets <= 0}
              loading={isBooking}
              className="w-full"
            >
              {event.availableTickets <= 0 ? t('events.sold_out') : t('events.book_now')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;