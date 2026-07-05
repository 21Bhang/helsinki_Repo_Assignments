import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "./context/NotificationContext"; // 🚀 Import Context
import App from "./App.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      {" "}
      {/* 🚀 Wrap Application Tree here */}
      <App />
    </NotificationContextProvider>
  </QueryClientProvider>,
);
