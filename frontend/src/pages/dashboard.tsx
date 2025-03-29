"use client";

import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useAuth } from "../hooks/use-auth";
import { Gamepad2, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface Game {
  id: string;
  gameType: string;
  opponent: string;
  result: string;
  date: string;
}

interface Friend {
  id: string;
  username: string;
  status: string;
  profilePicture: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    friends: 0,
  });
  const [loading, setLoading] = useState(true);

  const [gameHistory, setGameHistory] = useState<Game[]>([]);

  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    // Simulate fetching user stats
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setStats({
            gamesPlayed: 24,
            wins: 15,
            friends: 8,
          });

          setGameHistory([
            {
              id: "1",
              gameType: "chess",
              opponent: "ChessMaster42",
              result: "win",
              date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "2",
              gameType: "tic-tac-toe",
              opponent: "TicTacPro",
              result: "loss",
              date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "3",
              gameType: "chess",
              opponent: "GrandMaster99",
              result: "draw",
              date: new Date(
                Date.now() - 1 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              id: "4",
              gameType: "tic-tac-toe",
              opponent: "XOPlayer",
              result: "win",
              date: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ]);

          setFriends([
            {
              id: "1",
              username: "ChessMaster42",
              status: "online",
              profilePicture: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "2",
              username: "TicTacPro",
              status: "in-game",
              profilePicture: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "3",
              username: "GrandMaster99",
              status: "offline",
              profilePicture: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "4",
              username: "XOPlayer",
              status: "online",
              profilePicture: "/placeholder.svg?height=40&width=40",
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
          <p className="text-muted-foreground">
            Manage your games and connect with friends
          </p>
        </div>

        <Button asChild size="lg">
          <Link to="/games">
            <Gamepad2 className="mr-2 h-5 w-5" />
            Play Now
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Games Played"
          value={stats.gamesPlayed}
          icon={<Gamepad2 className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Wins"
          value={stats.wins}
          icon={<Trophy className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Friends"
          value={stats.friends}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="history">
            <Trophy className="mr-2 h-4 w-4" />
            Game History
          </TabsTrigger>
          <TabsTrigger value="friends">
            <Users className="mr-2 h-4 w-4" />
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <GameHistory history={gameHistory} />
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <FriendsList friends={friends} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-3xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function GameHistory({ history }: { history: Game[] }) {
  const getResultBadge = (result: string) => {
    switch (result) {
      case "win":
        return (
          <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Win
          </span>
        );
      case "loss":
        return (
          <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground">
            Loss
          </span>
        );
      case "draw":
        return (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            Draw
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Recent Games
        </h3>
        <p className="text-sm text-muted-foreground">
          Your latest matches and results
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              You haven't played any games yet
            </p>
          ) : (
            history.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <div className="font-medium">
                    {game.gameType === "chess" ? "Chess" : "Tic-Tac-Toe"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    vs {game.opponent}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(game.date)}
                  </div>
                  {getResultBadge(game.result)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FriendsList({ friends }: { friends: Friend[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Online
          </span>
        );
      case "in-game":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            In Game
          </span>
        );
      case "offline":
        return (
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            Offline
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6">
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Friends
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect and play with friends
          </p>
        </div>
        <Button size="sm" className="mt-4 sm:mt-0">
          <Users className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      </div>
      <div className="p-6 pt-0">
        <div className="mb-4">
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredFriends.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? "No friends match your search"
              : "You don't have any friends yet"}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full">
                    <img
                      src={friend.profilePicture || "/placeholder.svg"}
                      alt={friend.username}
                      className="rounded-full object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{friend.username}</div>
                    <div className="flex items-center mt-1">
                      {getStatusBadge(friend.status)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={friend.status === "offline"}
                  >
                    <Gamepad2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { MessageSquare } from "lucide-react";
