const Notification = ({ message, type }) => {
  if (!message) return null;
  return <div className={`notification ${type || "success"}`}>{message}</div>;
};

export default Notification;
