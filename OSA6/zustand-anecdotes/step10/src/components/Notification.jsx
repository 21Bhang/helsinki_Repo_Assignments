import { useNotificationStore } from "../notificationStore";

const Notification = () => {
  // 1. Grab the current active text string
  const message = useNotificationStore((state) => state.message);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  };

  // 2. Do not render anything on screen if message is empty
  if (!message) return null;

  return <div style={style}>{message}</div>;
};

export default Notification;
