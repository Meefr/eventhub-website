import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFeaturedEvents, getUpcomingEvents } from '../services/eventService';
import EventCard from './events/EventCard';
import SectionHeader from './common/SectionHeader';
import LoadingSpinner from './common/LoadingSpinner';
import Alert from './common/Alert';

const Home = () => {
  const { t } = useTranslation();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, [t]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <section className="mb-12">
        <SectionHeader title={t('home.featured_events')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title={t('home.upcoming_events')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;