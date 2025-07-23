import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { token } = useSelector((state) => state.user);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications(); // Refresh list
    } catch (err) {
      console.error("Failed to mark notification", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto my-4">
      <h2 className="text-xl font-semibold mb-2">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-3 rounded-md border shadow-sm ${
                notif.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <p>{notif.message}</p>
                <div className="flex gap-2 ml-4">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
