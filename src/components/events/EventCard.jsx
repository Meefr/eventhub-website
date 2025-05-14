import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useTheme } from "../../contexts/ThemeContext";

const EventCard = ({ event, isBooked }) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleClick = (id) => {
    console.log("EventCard", isBooked);

    navigate(`/events/${id}`, { state: { isBooked } });
  };

  const { t } = useTranslation();
  const eventDate = new Date(event.date).toLocaleDateString();
  return (
    <div
      onClick={() => handleClick(event._id)}
      className={`rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105
    ${darkMode ? "bg-secondry text-light" : "bg-light text-dark border-dark-400"}
  `}
    >
      <div className="relative">
        <img
          src={
            event.image
              ? `${event.image}`
              : "https://res.cloudinary.com/df7pfi9h3/image/upload/v1747155922/event-placeholder_udexpp.jpg"
          }
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        {event.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            {t("admin.events.featured")}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
        <p className={`${darkMode ? 'text-light' : 'text-dark'} text-sm mb-2 line-clamp-2`}>
          {event.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className={`text-sm ${darkMode ? 'text-light' : 'text-dark'}`}>
            {eventDate}
          </span>
          <span className="text-sm font-medium">${event.price}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-600">
            {event.availableTickets} {t("events.available_tickets")}
          </span>
          {
            <Link to={`/events/${event._id}`}>
              <Button disabled={isBooked} size="sm">
                {isBooked ? t("events.booked") : t("events.book_now")}
                {/* {t("home.book_now")} */}
              </Button>
            </Link>
          }
        </div>
      </div>
    </div>
  );
};

export default EventCard;
