import { createContext, useReducer, useContext } from "react";

// 1. Reducer managing state transitions
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

// 2. Context Provider Wrapper Component
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

// 3. Custom shorthand hook helper to consume the notification value
export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context[0];
};

// 4. Custom shorthand hook helper to dispatch actions
export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext);
  return context[1];
};

export default NotificationContext;
