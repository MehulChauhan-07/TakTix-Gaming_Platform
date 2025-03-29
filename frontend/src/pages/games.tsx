"use client"

import { SetStateAction, useEffect, useState } from "react"
import { Button } from "@components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { useAuth } from "@hooks/use-auth"
import { Gamepad2, Users, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export default function GamesPage() {
  const { user } = useAuth()
  const [isMatchmaking, setIsMatchmaking] = useState(false)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const startMatchmaking = (gameType: string) => {
    setSelectedGame(gameType)
    setIsMatchmaking(true)
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Games</h1>
          <p className="text-muted-foreground">Choose a game to play or join a match</p>
        </div>
      </div>

      <Tabs defaultValue="quick-play" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="quick-play">
            <Clock className="mr-2 h-4 w-4" />
            Quick Play
          </TabsTrigger>
          <TabsTrigger value="private">
            <Users className="mr-2 h-4 w-4" />
            Private Games
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-play" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard
              title="Chess"
              description="Classic strategy game"
              image="/placeholder.svg?height=200&width=300"
              onPlay={() => startMatchmaking("chess")}
            />

            <GameCard
              title="Tic-Tac-Toe"
              description="Simple yet strategic"
              image="/placeholder.svg?height=200&width=300"
              onPlay={() => startMatchmaking("tic-tac-toe")}
            />

            <GameCard
              title="Coming Soon"
              description="More games on the way"
              image="/placeholder.svg?height=200&width=300"
              onPlay={() => {}}
              disabled
            />
          </div>
        </TabsContent>

        <TabsContent value="private" className="mt-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Private Games</h3>
              <p className="text-sm text-muted-foreground">Create or join a private game with friends</p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-lg font-semibold">Create Game</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Create a private game and invite your friends</p>
                    <Button asChild className="w-full">
                      <Link to="/games/create">Create Game</Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-lg font-semibold">Join Game</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Join a private game with an invite code</p>
                    <Button asChild className="w-full">
                      <Link to="/games/join">Join Game</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isMatchmaking && selectedGame && (
        <MatchmakingModal
          gameType={selectedGame}
          onClose={() => {
            setIsMatchmaking(false)
            setSelectedGame(null)
          }}
        />
      )}
    </div>
  )
}

interface GameCardProps {
  title: string
  description: string
  image: string
  onPlay: () => void
  disabled?: boolean
}

function GameCard({ title, description, image, onPlay, disabled = false }: GameCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-6 pt-0">
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-32 w-auto object-contain"
            style={{ opacity: disabled ? 0.5 : 1 }}
          />
        </div>
        <Button className="w-full" onClick={onPlay} disabled={disabled}>
          <Gamepad2 className="mr-2 h-4 w-4" />
          {disabled ? "Coming Soon" : "Find Match"}
        </Button>
      </div>
    </div>
  )
}

function MatchmakingModal({ gameType, onClose }: { gameType: string; onClose: () => void }) {
  const [searchTime, setSearchTime] = useState(0)
  const [matchFound, setMatchFound] = useState(false)

  // Simulate finding a match after a random time between 3-8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTime((prev) => prev + 1)
    }, 1000)

    const matchTimer = setTimeout(
      () => {
        setMatchFound(true)

        // Redirect to game after 2 seconds
        setTimeout(() => {
          window.location.href = `/games/${gameType}/play?matchId=random-${Math.floor(Math.random() * 1000)}`
          onClose()
        }, 2000)
      },
      Math.floor(Math.random() * 5000) + 3000,
    )

    return () => {
      clearInterval(timer)
      clearTimeout(matchTimer)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getGameTitle = () => {
    switch (gameType) {
      case "chess":
        return "Chess"
      case "tic-tac-toe":
        return "Tic-Tac-Toe"
      default:
        return "Game"
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            {matchFound ? "Match Found!" : `Finding ${getGameTitle()} Match`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {matchFound ? "Connecting you with your opponent..." : "Searching for an opponent. This may take a moment."}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          {matchFound ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                <svg
                  className="animate-spin h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-lg font-medium">Connecting to game...</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                <div className="animate-pulse h-8 w-8 rounded-full bg-primary"></div>
              </div>
              <p className="text-lg font-medium mb-2">Searching for players...</p>
              <p className="text-sm text-muted-foreground">Time elapsed: {formatTime(searchTime)}</p>
            </>
          )}
        </div>

        {!matchFound && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

