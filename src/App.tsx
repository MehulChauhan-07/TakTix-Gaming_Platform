import { Routes, Route } from "react-router-dom"
import { SiteHeader } from "@components/layout/site-header"
import { SiteFooter } from "@components/layout/site-footer"
import HomePage from "@pages/home"
import DashboardPage from "@pages/dashboard"
import GamesPage from "@pages/games"
import GamePlayPage from "@pages/game-play"
import ProfilePage from "@pages/profile"
import LoginPage from "@pages/login"
import SignupPage from "@pages/signup"
import ProtectedRoute from "@components/protected-route"

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
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App

