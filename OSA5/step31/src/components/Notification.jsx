import { Alert } from "@mui/material";

// 5.30: render notifications as a MUI Alert so success/error are
// communicated with both colour and an icon.
const Notification = ({ notification }) => {
  if (!notification) {
    return null;
  }

  return (
    <Alert
      severity={notification.type === "error" ? "error" : "success"}
      // keep the className the old E2E selector ".notification.error" relies on
      className={`notification ${notification.type}`}
      sx={{ my: 2 }}
    >
      {notification.message}
    </Alert>
  );
};

export default Notification;
