import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./components/auth-provider";
import { SocketProvider } from "./contexts/SocketContext";
import { GameProvider } from "./contexts/GameContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="taktix-theme">
        <AuthProvider>
          <SocketProvider>
            <GameProvider>
              <App />
            </GameProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
