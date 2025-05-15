import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getUserBookings, cancelBooking } from "../services/bookingService";
import LoadingSpinner from "./common/LoadingSpinner";
import Alert from "./common/Alert";
import Button from "./common/Button";
import { useTheme } from "../contexts/ThemeContext";

const Bookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    fetchBookings();
  }, [t]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(t("bookings.cancel_confirm"))) return;

    try {
      setError("");
      setSuccess("");
      await cancelBooking(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      setSuccess(t("bookings.cancel_success"));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setError(error.response?.data?.message || t("bookings.cancel_error"));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  const { darkMode } = useTheme();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("bookings.title")}</h1>

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

      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t("bookings.no_bookings")}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${darkMode ? "bg-gray-600" : "bg-light"}`}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? "text-light" : "text-dark"
                    } uppercase tracking-wider`}
                  >
                    {t("bookings.event")}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? "text-light" : "text-dark"
                    } uppercase tracking-wider`}
                  >
                    {t("bookings.date")}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? "text-light" : "text-dark"
                    } uppercase tracking-wider`}
                  >
                    {t("bookings.status")}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? "text-light" : "text-dark"
                    } uppercase tracking-wider`}
                  >
                    {t("bookings.tickets")}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode ? "text-light" : "text-dark"
                    } uppercase tracking-wider`}
                  >
                    {t("bookings.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode?'bg-gray-800 text-light' : 'bg-gray-50 text-dark'} divide-y divide-gray-200 dark:divide-gray-700`}>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-dark'}`}>
                        {booking.event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-light' : 'text-dark'}`}>
                        {new Date(booking.event.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {t(`bookings.${booking.status}`)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-light' : 'text-dark'}`}>
                      {booking.ticketCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          {t("bookings.cancel")}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
