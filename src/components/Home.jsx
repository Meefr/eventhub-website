import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFeaturedEvents, getUpcomingEvents } from "../services/eventService";
import EventCard from "./events/EventCard";
import SectionHeader from "./common/SectionHeader";
import LoadingSpinner from "./common/LoadingSpinner";
import Alert from "./common/Alert";
import { getUserBookings } from "../services/bookingService";

const Home = () => {
  const { t } = useTranslation();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data } = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(t("bookings.fetch_error"));
      } finally {
        setLoading(false);
      }
    };
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedEvents();
        const upcoming = await getUpcomingEvents();
        setFeaturedEvents(featured.data);
        setUpcomingEvents(upcoming.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(t("events.fetch_error"));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    fetchEvents();
  }, [t]);
  const checkIfBooked = (eventId) => {
    const bookedEvent = bookings.find(
      (booking) => booking.event._id === eventId
    );
    console.log("bookedEvent", bookedEvent);

    return bookedEvent ? true : false;
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      <section className="mb-12">
        <SectionHeader title={t("home.featured_events")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} isBooked={checkIfBooked(event._id)}/>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title={t("home.upcoming_events")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} isBooked={checkIfBooked(event._id)}/>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
