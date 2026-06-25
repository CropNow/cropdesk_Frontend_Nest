import "@shared/styles/index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@app/App";
import { AuthProvider } from "@app/providers/AuthContext";
import { ThemeProvider } from "@app/providers/ThemeContext";
import { ToastProvider } from "@app/providers/ToastContext";
import { ToastContainer } from "@shared/components/ToastContainer";
import { OnlineStatusProvider } from "@app/providers/OnlineStatusContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <OnlineStatusProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </OnlineStatusProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
