import React from "react";

import ReactDOM from "react-dom/client";

import {
  Toaster,
} from "react-hot-toast";

import {
  AnimatePresence,
} from "framer-motion";

import App from "./App";

import "./index.css";

import AuthProvider from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <React.StrictMode>

    <AuthProvider>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,

          style: {
            background:
              "#ffffff",

            color:
              "#0f172a",

            border:
              "1px solid #e2e8f0",

            borderRadius:
              "18px",

            padding:
              "16px 18px",

            boxShadow:
              "0 10px 30px rgba(15,23,42,0.08)",

            fontSize:
              "14px",

            fontWeight:
              "500",
          },

          success: {
            iconTheme: {
              primary:
                "#0f172a",

              secondary:
                "#ffffff",
            },
          },

          error: {
            iconTheme: {
              primary:
                "#ef4444",

              secondary:
                "#ffffff",
            },
          },
        }}
      />

      {/* Page Animation Wrapper */}
      <AnimatePresence
        mode="wait"
      >

        <App />

      </AnimatePresence>

    </AuthProvider>

  </React.StrictMode>
);