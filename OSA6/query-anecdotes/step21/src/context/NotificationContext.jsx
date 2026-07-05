import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    "",
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to read the raw context text string value
export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context[0];
};

// 🚀 NEW: Custom hook encapsulating the timer logic cleanly
export const useNotify = () => {
  const context = useContext(NotificationContext);
  const dispatch = context[1];

  return (message) => {
    dispatch({ type: "SET", payload: message });
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };
};

export default NotificationContext;
