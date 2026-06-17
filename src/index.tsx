import React from "react";
import "@shared/styles/index.css";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "@app/App";
import { AuthProvider } from "@app/providers/AuthContext";
import { ThemeProvider } from "@app/providers/ThemeContext";
import { ToastProvider } from "@app/providers/ToastContext";
import { ToastContainer } from "@shared/components/ToastContainer";

render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root"),
);
