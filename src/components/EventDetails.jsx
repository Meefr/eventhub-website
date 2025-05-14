import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEvent } from "../services/eventService";
import { createBooking } from "../services/bookingService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./common/LoadingSpinner";
import Button from "./common/Button";
import Alert from "./common/Alert";
import { useTheme } from "../contexts/ThemeContext";

const EventDetails = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { isBooked } = location.state || {};
  const [isBookedState, setIsBookedState] = useState(isBooked || false);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await getEvent(id);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(t("events.fetch_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]);

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setIsBooking(true);
      setError("");
      await createBooking({ event: id, ticketCount: 1 });
      setSuccess(t("bookings.success"));
      setIsBookedState(true);
      // navigate("/");
    } catch (error) {
      console.error("Booking failed:", error);
      setError(error.response?.data?.message || t("bookings.error"));
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return <div className="text-center py-8">{t("events.not_found")}</div>;
  }

  return (
    <div
      
    >
      <div className={`max-w-4xl mx-auto py-8 px-4`}>
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        <div
          className={`rounded-lg shadow-lg overflow-hidden
    ${
      darkMode ? "bg-secondry text-light" : "bg-light text-dark border-dark-400"
    }`}
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={
                  event.image ? `${event.image}` : "../event-placeholder.jpg"
                }
                alt={event.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            <div className="p-6 md:w-1/2">
              <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {event.description}
              </p>

              <div className="space-y-3 mb-6">
                <div>
                  <span className="font-semibold">{t("events.date")}:</span>
                  <span> {new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-semibold">{t("events.location")}:</span>
                  <span> {event.location}</span>
                </div>
                <div>
                  <span className="font-semibold">{t("events.price")}:</span>
                  <span> ${event.price}</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {t("events.available_tickets")}:
                  </span>
                  <span> {event.availableTickets}</span>
                </div>
                <div>
                  <span className="font-semibold">{t("events.category")}:</span>
                  <span> {event.category?.name}</span>
                </div>
              </div>

              {/* Tags Section */}
              {event.tags && event.tags.length > 0 && (
                <div className="mb-6">
                  <span className="font-semibold">{t("events.tags")}:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleBookEvent}
                disabled={isBookedState || event.availableTickets <= 0}
                loading={isBooking}
                className="w-full"
              >
                {isBookedState
                  ? t("events.booked")
                  : event.availableTickets <= 0
                  ? t("events.sold_out")
                  : t("events.book_now")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
