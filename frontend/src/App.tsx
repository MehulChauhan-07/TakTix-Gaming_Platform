import { Routes, Route, useLocation } from "react-router-dom";
import { SiteHeader } from "@components/layout/site-header";
import { SiteFooter } from "@components/layout/site-footer";
import { AnimatedRoute } from "@components/layout/motion-layout";
import HomePage from "@pages/home/home";
import DashboardPage from "@pages/dashboard/dashboard";
import GamesPage from "@pages/games/games";
import GamePlayPage from "@pages/games/game-play";
import ProfilePage from "@pages/profile/profile";
import LoginPage from "@pages/auth/login";
import SignupPage from "@pages/auth/signup";
import ProtectedRoute from "@components/protected-route";
import { GameState } from "@/src/types/game.types";
import { ReactNode } from "react";
import TempPage from "./pages/temp";

// Define request/response types
interface MakeMoveRequest {
  gameId: string;
  position: number;
  playerId: string;
}

interface MakeMoveResponse {
  status: "success" | "error";
  data?: GameState;
  message?: string;
}

// Custom error classes
export class GameError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "GameError";
  }
}

function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 relative">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GamesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/games/:gameType/play"
            element={
              <ProtectedRoute>
                <GamePlayPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/temp" element={<TempPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
