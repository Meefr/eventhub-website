import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFeaturedEvents, getUpcomingEvents } from "../services/eventService";
import EventCard from "./events/EventCard";
import SectionHeader from "./common/SectionHeader";
import LoadingSpinner from "./common/LoadingSpinner";
import Alert from "./common/Alert";
import { getUserBookings } from "../services/bookingService";
import Pagination from "./common/Pagination"; // Assuming you have a Pagination component
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const { darkMode } = useTheme();
  // Pagination states
  const [featuredPagination, setFeaturedPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
  });
  const [upcomingPagination, setUpcomingPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(t("bookings.fetch_error"));
      }
    };

    fetchBookings();
  }, [t]);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedEvents(
          featuredPagination.page,
          featuredPagination.limit
        );
        setFeaturedEvents(featured.data);
        setFeaturedPagination((prev) => ({
          ...prev,
          total: featured.total || 0,
          pagination: featured.pagination || {},
        }));
      } catch (error) {
        console.error("Error fetching featured events:", error);
        setError(t("events.fetch_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [featuredPagination.page, featuredPagination.limit, t]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const upcoming = await getUpcomingEvents(
          upcomingPagination.page,
          upcomingPagination.limit
        );
        setUpcomingEvents(upcoming.data);
        setUpcomingPagination((prev) => ({
          ...prev,
          total: upcoming.total || 0,
          pagination: upcoming.pagination || {},
        }));
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        setError(t("events.fetch_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [upcomingPagination.page, upcomingPagination.limit, t]);

  const checkIfBooked = (eventId) => {
    const bookedEvent = bookings.find(
      (booking) => booking.event._id === eventId
    );
    return bookedEvent ? true : false;
  };

  const handleFeaturedPageChange = (newPage) => {
    setFeaturedPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleUpcomingPageChange = (newPage) => {
    setUpcomingPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  if (loading && !featuredEvents.length && !upcomingEvents.length) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={`${
        darkMode ? "bg-dark" : "bg-bg_light"
      } mx-auto px-4 py-8`}
    >
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      <section>
        <div className="flex justify-between items-center mb-4">
          <SectionHeader title={t("home.upcoming_events")} />
          {/* {upcomingPagination.total > upcomingPagination.limit && (
            <div className="flex items-center">
              <span className="mr-3 text-gray-600">
                {t("pagination.page")} {upcomingPagination.page} / 
                {Math.ceil(upcomingPagination.total / upcomingPagination.limit)}
              </span>
              <Pagination 
                currentPage={upcomingPagination.page}
                totalPages={Math.ceil(upcomingPagination.total / upcomingPagination.limit)}
                onPageChange={handleUpcomingPageChange}
              />
            </div>
          )} */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isBooked={checkIfBooked(event._id)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              {t("events.no_upcoming_events")}
            </div>
          )}
        </div>
        {upcomingPagination.total > upcomingPagination.limit && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={upcomingPagination.page}
              totalPages={Math.ceil(
                upcomingPagination.total / upcomingPagination.limit
              )}
              onPageChange={handleUpcomingPageChange}
            />
          </div>
        )}
      </section>
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4 mt-8">
          <SectionHeader title={t("home.featured_events")} />
          {/* {featuredPagination.total > featuredPagination.limit && (
            <div className="flex items-center">
              <span className="mr-3 text-gray-600">
                {t("pagination.page")} {featuredPagination.page} / 
                {Math.ceil(featuredPagination.total / featuredPagination.limit)}
              </span>
              <Pagination 
                currentPage={featuredPagination.page}
                totalPages={Math.ceil(featuredPagination.total / featuredPagination.limit)}
                onPageChange={handleFeaturedPageChange}
              />
            </div>
          )} */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isBooked={checkIfBooked(event._id)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              {t("events.no_featured_events")}
            </div>
          )}
        </div>
        {featuredPagination.total > featuredPagination.limit && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={featuredPagination.page}
              totalPages={Math.ceil(
                featuredPagination.total / featuredPagination.limit
              )}
              onPageChange={handleFeaturedPageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
