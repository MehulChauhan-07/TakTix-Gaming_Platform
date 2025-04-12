"use client";

import { useState, useEffect } from "react";
import { Progress } from "@components/ui/progress";
import { useAuth } from "@hooks/use-Auth";
import {
  Award,
  Trophy,
  Target,
  Zap,
  Clock,
  Users,
  Star,
  Lock,
} from "lucide-react";

export function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      progress: number;
      maxProgress: number;
      completed: boolean;
      unlockedAt?: string;
      category: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching achievements
    const fetchAchievements = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setAchievements([
            {
              id: "1",
              title: "First Victory",
              description: "Win your first game",
              icon: "trophy",
              progress: 1,
              maxProgress: 1,
              completed: true,
              unlockedAt: new Date(
                Date.now() - 15 * 24 * 60 * 60 * 1000
              ).toISOString(),
              category: "general",
            },
            {
              id: "2",
              title: "Chess Novice",
              description: "Win 5 chess games",
              icon: "trophy",
              progress: 3,
              maxProgress: 5,
              completed: false,
              category: "chess",
            },
            {
              id: "3",
              title: "Tic-Tac-Pro",
              description: "Win 10 Tic-Tac-Toe games",
              icon: "trophy",
              progress: 8,
              maxProgress: 10,
              completed: false,
              category: "tic-tac-toe",
            },
            {
              id: "4",
              title: "Winning Streak",
              description: "Win 3 games in a row",
              icon: "zap",
              progress: 3,
              maxProgress: 3,
              completed: true,
              unlockedAt: new Date(
                Date.now() - 5 * 24 * 60 * 60 * 1000
              ).toISOString(),
              category: "general",
            },
            {
              id: "5",
              title: "Social Butterfly",
              description: "Add 5 friends",
              icon: "users",
              progress: 2,
              maxProgress: 5,
              completed: false,
              category: "general",
            },
            {
              id: "6",
              title: "Chess Master",
              description: "Win a chess game in under 20 moves",
              icon: "clock",
              progress: 0,
              maxProgress: 1,
              completed: false,
              category: "chess",
            },
            {
              id: "7",
              title: "Perfect Tic-Tac-Toe",
              description:
                "Win a Tic-Tac-Toe game without letting your opponent mark any squares",
              icon: "target",
              progress: 0,
              maxProgress: 1,
              completed: false,
              category: "tic-tac-toe",
            },
            {
              id: "8",
              title: "Dedicated Player",
              description: "Play 50 games",
              icon: "star",
              progress: 42,
              maxProgress: 50,
              completed: false,
              category: "general",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchAchievements();
    }
  }, [user]);

  interface IconProps {
    iconName: string;
  }

  const getIcon = (iconName: IconProps["iconName"]): JSX.Element => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-6 w-6" />;
      case "target":
        return <Target className="h-6 w-6" />;
      case "zap":
        return <Zap className="h-6 w-6" />;
      case "clock":
        return <Clock className="h-6 w-6" />;
      case "users":
        return <Users className="h-6 w-6" />;
      case "star":
        return <Star className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Achievements
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your gaming milestones
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-48 bg-muted rounded animate-pulse mb-3"></div>
                  <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Achievements
          </h3>
          <p className="text-sm text-muted-foreground">
            No achievements available yet
          </p>
        </div>
        <div className="p-6 pt-0">
          <p className="text-center py-8 text-muted-foreground">
            Start playing to unlock achievements!
          </p>
        </div>
      </div>
    );
  }

  // Group achievements by category
  const completedAchievements = achievements.filter((a) => a.completed);
  const inProgressAchievements = achievements.filter((a) => !a.completed);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Achievements
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your gaming milestones
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
              <span>Completed: {completedAchievements.length}</span>
            </div>
            <div className="flex items-center ml-4">
              <div className="w-3 h-3 rounded-full bg-muted-foreground mr-1"></div>
              <span>Locked: {inProgressAchievements.length}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Completed</h3>
          {completedAchievements.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No achievements completed yet.
            </p>
          ) : (
            <div className="space-y-4">
              {completedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {getIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {achievement.unlockedAt &&
                          new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-lg font-medium pt-4">In Progress</h3>
          {inProgressAchievements.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No achievements in progress.
            </p>
          ) : (
            <div className="space-y-4">
              {inProgressAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground relative">
                    {getIcon(achievement.icon)}
                    <div className="absolute -top-1 -right-1">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <Progress
                      value={
                        (achievement.progress / achievement.maxProgress) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
