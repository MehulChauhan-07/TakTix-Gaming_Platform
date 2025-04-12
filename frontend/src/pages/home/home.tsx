"use client";

import type React from "react";

import { Button } from "@components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/use-Auth";
import { motion } from "framer-motion";
import {
  Gamepad2,
  MessageSquare,
  Trophy,
  ShieldCheck,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  EnhancedGameCard,
  FeatureCard,
  UpdateCard,
} from "@pages/home/components/gamecard";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen">
      {/* Hero Section with Enhanced Visual Elements */}
      <div className="relative bg-gradient-to-b from-primary/20 to-background pt-20 pb-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
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
            Challenge players worldwide in strategic board games like Chess and
            Tic-Tac-Toe
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

      {/* Featured Games with Enhanced Cards */}
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnhancedGameCard
            title="Chess"
            description="The classic strategy game of kings and queens"
            image="/placeholder.svg?height=200&width=300"
            players="2 Players"
            href="/games"
          />
          <EnhancedGameCard
            title="Tic-Tac-Toe"
            description="Simple yet strategic game of X's and O's"
            image="/placeholder.svg?height=200&width=300"
            players="2 Players"
            href="/games"
          />
          <EnhancedGameCard
            title="Coming Soon"
            description="More multiplayer games are on the way!"
            image="/placeholder.svg?height=200&width=300"
            players="3-4 Players"
            href="#"
            disabled
          />
        </div>
      </div>

      {/* Latest Updates Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Updates</h2>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/news" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UpdateCard
              title="New Chess Tournament"
              date="March 25, 2025"
              description="Join our monthly tournament with prizes for the top players! Registration is now open for all skill levels."
            />
            <UpdateCard
              title="Tic-Tac-Toe Leaderboard Reset"
              date="March 20, 2025"
              description="Season 2 has begun! Your ranks have been reset for the new season. Climb to the top again!"
            />
            <UpdateCard
              title="Coming Soon: Connect Four"
              date="March 15, 2025"
              description="Our next game is in development and will be released next month. Get ready for a new challenge!"
            />
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link
                to="/news"
                className="flex items-center gap-2 mx-auto justify-center"
              >
                View All Updates <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Features
          </h2>

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
  );
}
