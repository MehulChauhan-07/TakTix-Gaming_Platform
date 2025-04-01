import { Routes, Route } from "react-router-dom";
import { SiteHeader } from "@components/layout/site-header";
import { SiteFooter } from "@components/layout/site-footer";
import HomePage from "@pages/home";
import DashboardPage from "@pages/dashboard";
import GamesPage from "@pages/games";
import GamePlayPage from "@pages/game-play";
import ProfilePage from "@pages/profile";
import LoginPage from "@pages/login";
import SignupPage from "@pages/signup";
import ProtectedRoute from "@components/protected-route";
import { GameState } from "./types/game.types";

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
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
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

          {/* <Route path="/temp" element={<TempPage />} /> */}
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
