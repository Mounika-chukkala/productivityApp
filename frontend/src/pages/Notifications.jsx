import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
const {token}=useSelector((slice)=>slice.user)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        setNotifications(res.data.reverse());
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto my-4">
      <h2 className="text-xl font-semibold mb-2">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif._id} className="bg-gray-100 p-2 rounded-md">
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
