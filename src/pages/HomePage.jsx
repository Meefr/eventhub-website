import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFeaturedEvents, getUpcomingEvents } from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import SectionHeader from '../../components/common/SectionHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { getUserBookings } from '../services/bookingService';

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data } = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(t('bookings.fetch_error'));
      } finally {
        setLoading(false);
      }
    }
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedEvents();
        const upcoming = await getUpcomingEvents();
        setFeaturedEvents(featured.data);
        setUpcomingEvents(upcoming.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(t('events.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    fetchBookings();
  }, [t]);
  const checkIfBooked = (eventId) => {
    const bookedEvent = bookings.find(booking => booking.event._id === eventId);
    console.log("bookedEvent", bookedEvent);
    
    return bookedEvent ? true : false;
  }
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-12">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <section>
        <SectionHeader title={t('home.featured_events')} />
        {featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event._id} event={event} isBooked={checkIfBooked(event._id)}/>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('home.no_featured_events')}
          </p>
        )}
      </section>

      <section>
        <SectionHeader title={t('home.upcoming_events')} />
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event._id} event={event} isBooked={checkIfBooked(event._id)}/>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('home.no_upcoming_events')}
          </p>
        )}
      </section>
    </div>
  );
};

export default HomePage;