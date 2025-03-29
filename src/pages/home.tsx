"use client"

import type React from "react"

import { Button } from "@components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@hooks/use-auth"
import { motion } from "framer-motion"
import { Gamepad2, MessageSquare, Trophy, ShieldCheck, Users, Zap } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/20 to-background pt-20 pb-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to <span className="text-primary">Taktix</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-2xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Challenge players worldwide in strategic board games like Chess and Tic-Tac-Toe
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {user ? (
              <>
                <Button asChild size="lg">
                  <Link to="/dashboard">My Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/games">Play Now</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/auth/signup">Sign Up</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/auth/login">Login</Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(circle_500px_at_50%_200px,#3730a3,transparent)]"></div>
      </div>

      {/* Featured Games */}
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            title="Chess"
            description="The classic strategy game of kings and queens"
            image="/placeholder.svg?height=200&width=300"
            players="2 Players"
            href="/games"
          />
          <GameCard
            title="Tic-Tac-Toe"
            description="Simple yet strategic game of X's and O's"
            image="/placeholder.svg?height=200&width=300"
            players="2 Players"
            href="/games"
          />
          <GameCard
            title="Coming Soon"
            description="More multiplayer games are on the way!"
            image="/placeholder.svg?height=200&width=300"
            players="3-4 Players"
            href="#"
            disabled
          />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gamepad2 className="h-10 w-10 text-primary" />}
              title="Multiple Games"
              description="Play Chess, Tic-Tac-Toe and more games coming soon"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Real-Time Multiplayer"
              description="Challenge friends or get matched with players worldwide"
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-primary" />}
              title="In-Game Chat"
              description="Communicate with your opponents during gameplay"
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10 text-primary" />}
              title="Leaderboards"
              description="Compete for top positions and track your progress"
            />
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Secure Authentication"
              description="Your account is protected with modern security"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Fast Matchmaking"
              description="Find opponents quickly with our matchmaking system"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

interface GameCardProps {
  title: string
  description: string
  image: string
  players: string
  href: string
  disabled?: boolean
}

function GameCard({ title, description, image, players, href, disabled = false }: GameCardProps) {
  return (
    <div className="bg-card overflow-hidden rounded-lg border shadow transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            {players}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button asChild className="w-full" disabled={disabled}>
          <Link to={disabled ? "#" : href}>{disabled ? "Coming Soon" : "Play Now"}</Link>
        </Button>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

