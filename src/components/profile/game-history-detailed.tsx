"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuth } from "../../hooks/use-auth"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export function GameHistoryDetailed() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [gameTypeFilter, setGameTypeFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    // Simulate fetching game history
    const fetchHistory = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setHistory([
            {
              id: "1",
              gameType: "chess",
              opponent: "ChessMaster42",
              result: "win",
              date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              duration: 720, // 12 minutes
              moves: 34,
              score: 1200,
            },
            {
              id: "2",
              gameType: "tic-tac-toe",
              opponent: "TicTacPro",
              result: "loss",
              date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              duration: 45, // 45 seconds
              moves: 5,
            },
            {
              id: "3",
              gameType: "chess",
              opponent: "GrandMaster99",
              result: "draw",
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 1500, // 25 minutes
              moves: 60,
              score: 1150,
            },
            {
              id: "4",
              gameType: "tic-tac-toe",
              opponent: "XOPlayer",
              result: "win",
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 60, // 1 minute
              moves: 7,
            },
            {
              id: "5",
              gameType: "chess",
              opponent: "ChessKing",
              result: "loss",
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 900, // 15 minutes
              moves: 25,
              score: 1100,
            },
            {
              id: "6",
              gameType: "tic-tac-toe",
              opponent: "GameMaster",
              result: "win",
              date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 30, // 30 seconds
              moves: 5,
            },
            {
              id: "7",
              gameType: "chess",
              opponent: "ChessNovice",
              result: "win",
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 600, // 10 minutes
              moves: 20,
              score: 1250,
            },
            {
              id: "8",
              gameType: "tic-tac-toe",
              opponent: "TicTacMaster",
              result: "draw",
              date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 90, // 1.5 minutes
              moves: 9,
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching game history:", error)
        setLoading(false)
      }
    }

    if (user) {
      fetchHistory()
    }
  }, [user])

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes === 0) {
      return `${remainingSeconds}s`
    } else if (remainingSeconds === 0) {
      return `${minutes}m`
    } else {
      return `${minutes}m ${remainingSeconds}s`
    }
  }

  const getResultBadge = (result) => {
    switch (result) {
      case "win":
        return (
          <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Win
          </span>
        )
      case "loss":
        return (
          <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground">
            Loss
          </span>
        )
      case "draw":
        return (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Draw</span>
        )
      default:
        return null
    }
  }

  // Filter and search logic
  const filteredHistory = history.filter((game) => {
    const matchesSearch = game.opponent.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGameType = gameTypeFilter === "all" || game.gameType === gameTypeFilter
    const matchesResult = resultFilter === "all" || game.result === resultFilter

    return matchesSearch && matchesGameType && matchesResult
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Game History</h3>
          <p className="text-sm text-muted-foreground">Your detailed match history</p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
                <div className="flex-1 h-4 bg-muted rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Game History</h3>
          <p className="text-sm text-muted-foreground">You haven't played any games yet</p>
        </div>
        <div className="p-6 pt-0">
          <p className="text-center py-8 text-muted-foreground">Start playing to build your game history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Game History</h3>
        <p className="text-sm text-muted-foreground">Your detailed match history</p>
      </div>
      <div className="p-6 pt-0">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by opponent..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <select
              className="flex h-10 w-[130px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={gameTypeFilter}
              onChange={(e) => setGameTypeFilter(e.target.value)}
            >
              <option value="all">All Games</option>
              <option value="chess">Chess</option>
              <option value="tic-tac-toe">Tic-Tac-Toe</option>
            </select>

            <select
              className="flex h-10 w-[130px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
            >
              <option value="all">All Results</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
              <option value="draw">Draws</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">Game</th>
                <th className="text-left py-3 px-2 font-medium">Opponent</th>
                <th className="text-left py-3 px-2 font-medium">Result</th>
                <th className="text-left py-3 px-2 font-medium">Date</th>
                <th className="text-left py-3 px-2 font-medium">Duration</th>
                <th className="text-left py-3 px-2 font-medium">Moves</th>
                {filteredHistory.some((game) => game.score !== undefined) && (
                  <th className="text-left py-3 px-2 font-medium">Score</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No games match your filters
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((game) => (
                  <tr key={game.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-2">{game.gameType === "chess" ? "Chess" : "Tic-Tac-Toe"}</td>
                    <td className="py-3 px-2">{game.opponent}</td>
                    <td className="py-3 px-2">{getResultBadge(game.result)}</td>
                    <td className="py-3 px-2">
                      <div className="text-sm">
                        {new Date(game.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatTimeAgo(game.date)}</div>
                    </td>
                    <td className="py-3 px-2">{formatDuration(game.duration)}</td>
                    <td className="py-3 px-2">{game.moves}</td>
                    {filteredHistory.some((game) => game.score !== undefined) && (
                      <td className="py-3 px-2">{game.score || "-"}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} games
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()

  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
}

