import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="p-6 bg-[#f6fdf4] rounded-xl shadow-lg max-w-xl mx-auto my-6 border border-[#cde4cb]">
      <h2 className="text-2xl font-semibold text-[#4b8b3b] mb-4 flex items-center gap-2">
         Notifications
      </h2>
      {notifications.length === 0 ? (
        <p className="text-[#4b8b3b] text-lg">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`flex items-start justify-between p-4 rounded-lg shadow-sm transition duration-200 ${
                notif.read
                  ? "bg-[#dbead2] text-gray-600"
                  : "bg-[#c8e6b0] text-[#1e3a1a] font-medium"
              }`}
            >
              <span className="pr-3">{notif.message}</span>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className=" cursor-pointer ml-4 text-sm bg-[#4b8b3b] text-white px-3 py-1 rounded-md hover:bg-[#3a6c2c] transition"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
