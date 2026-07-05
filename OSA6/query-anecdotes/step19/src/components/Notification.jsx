import { useNotificationValue } from "../context/NotificationContext"; // 🚀 Import consumer hook

const Notification = () => {
  const message = useNotificationValue(); // 🚀 Consume global message string

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    borderRadius: "4px",
  };

  // 1. Do not mount elements onto screen layout structures if string is empty
  if (!message) return null;

  return <div style={style}>{message}</div>;
};

export default Notification;
