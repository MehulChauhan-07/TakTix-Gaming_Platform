"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useAuth } from "../../hooks/use-auth"

export function GameStatistics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching game statistics
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setStats({
            totalGames: 42,
            wins: 24,
            losses: 12,
            draws: 6,
            winRate: 57.14, // (24/42) * 100
            chessStats: {
              totalGames: 25,
              wins: 14,
              losses: 8,
              draws: 3,
              winRate: 56, // (14/25) * 100
            },
            ticTacToeStats: {
              totalGames: 17,
              wins: 10,
              losses: 4,
              draws: 3,
              winRate: 58.82, // (10/17) * 100
            },
            recentPerformance: [
              { date: "Jan", wins: 3, losses: 1, draws: 0 },
              { date: "Feb", wins: 4, losses: 2, draws: 1 },
              { date: "Mar", wins: 5, losses: 2, draws: 1 },
              { date: "Apr", wins: 3, losses: 1, draws: 2 },
              { date: "May", wins: 4, losses: 3, draws: 0 },
              { date: "Jun", wins: 5, losses: 3, draws: 2 },
            ],
          })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Game Statistics</h3>
          <p className="text-sm text-muted-foreground">Your gaming performance</p>
        </div>
        <div className="p-6 pt-0">
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Game Statistics</h3>
          <p className="text-sm text-muted-foreground">No statistics available yet</p>
        </div>
        <div className="p-6 pt-0">
          <p className="text-center py-8 text-muted-foreground">Start playing games to build your statistics!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Game Statistics</h3>
        <p className="text-sm text-muted-foreground">Your gaming performance across all games</p>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Games</h3>
            <p className="text-3xl font-bold">{stats.totalGames}</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Win Rate</h3>
            <p className="text-3xl font-bold">{stats.winRate.toFixed(1)}%</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Win/Loss Ratio</h3>
            <p className="text-3xl font-bold">{(stats.wins / (stats.losses || 1)).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Game Outcomes</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span>Wins: {stats.wins}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span>Losses: {stats.losses}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                    <span>Draws: {stats.draws}</span>
                  </div>
                </div>
                <div className="relative h-40 w-40 mx-auto">
                  {/* Simple pie chart representation */}
                  <div
                    className="absolute inset-0 rounded-full border-8 border-green-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((stats.wins / stats.totalGames) * Math.PI * 2)}% ${50 - 50 * Math.sin((stats.wins / stats.totalGames) * Math.PI * 2)}%, 50% 50%)`,
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-red-500"
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((stats.wins / stats.totalGames) * Math.PI * 2)}% ${50 - 50 * Math.sin((stats.wins / stats.totalGames) * Math.PI * 2)}%, ${50 + 50 * Math.cos(((stats.wins + stats.losses) / stats.totalGames) * Math.PI * 2)}% ${50 - 50 * Math.sin(((stats.wins + stats.losses) / stats.totalGames) * Math.PI * 2)}%, 50% 50%)`,
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-amber-500"
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((stats.wins + stats.losses) / stats.totalGames) * Math.PI * 2)}% ${50 - 50 * Math.sin(((stats.wins + stats.losses) / stats.totalGames) * Math.PI * 2)}%, 100% 50%, 50% 50%)`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Recent Performance</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full">
                <div className="flex items-end justify-between h-40 gap-1">
                  {stats.recentPerformance.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col-reverse">
                        <div className="bg-green-500 h-[1px]" style={{ height: `${(month.wins / 5) * 100}px` }}></div>
                        <div className="bg-red-500 h-[1px]" style={{ height: `${(month.losses / 5) * 100}px` }}></div>
                        <div className="bg-amber-500 h-[1px]" style={{ height: `${(month.draws / 5) * 100}px` }}></div>
                      </div>
                      <span className="text-xs mt-2">{month.date}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 mr-1"></div>
                    <span className="text-xs">Wins</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 mr-1"></div>
                    <span className="text-xs">Losses</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 mr-1"></div>
                    <span className="text-xs">Draws</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="chess">Chess</TabsTrigger>
            <TabsTrigger value="tic-tac-toe">Tic-Tac-Toe</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Games</h3>
                <p className="text-2xl font-bold">{stats.totalGames}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Wins</h3>
                <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Losses</h3>
                <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Draws</h3>
                <p className="text-2xl font-bold text-amber-500">{stats.draws}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chess" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Games</h3>
                <p className="text-2xl font-bold">{stats.chessStats.totalGames}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Wins</h3>
                <p className="text-2xl font-bold text-green-500">{stats.chessStats.wins}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Losses</h3>
                <p className="text-2xl font-bold text-red-500">{stats.chessStats.losses}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Draws</h3>
                <p className="text-2xl font-bold text-amber-500">{stats.chessStats.draws}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tic-tac-toe" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Games</h3>
                <p className="text-2xl font-bold">{stats.ticTacToeStats.totalGames}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Wins</h3>
                <p className="text-2xl font-bold text-green-500">{stats.ticTacToeStats.wins}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Losses</h3>
                <p className="text-2xl font-bold text-red-500">{stats.ticTacToeStats.losses}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Draws</h3>
                <p className="text-2xl font-bold text-amber-500">{stats.ticTacToeStats.draws}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

