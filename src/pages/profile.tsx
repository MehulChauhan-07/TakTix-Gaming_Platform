"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { User, Mail, Camera, Trophy, History, Award } from "lucide-react"
import { GameStatistics } from "@components/profile/game-statistics"
import { GameHistoryDetailed } from "@components/profile/game-history-detailed"
import { Achievements } from "@components/profile/achievements"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
    }
  }, [user])

  const handleSaveProfile = async () => {
    // In a real app, this would be an API call to update the user profile
    console.log("Saving profile:", { username, email })
    setIsEditing(false)
    // After successful update, you would update the user context
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your account information</p>
            </div>
            <div className="p-6 pt-0 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="relative h-24 w-24 rounded-full">
                  <img
                    src={user?.profilePicture || "/placeholder.svg?height=96&width=96"}
                    alt={user?.username}
                    className="rounded-full object-cover h-full w-full"
                  />
                  <div className="absolute inset-0 rounded-full flex items-center justify-center text-2xl font-semibold bg-primary text-primary-foreground opacity-0 hover:opacity-80 transition-opacity">
                    {user?.username.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>

              {!isEditing ? (
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="space-y-4 w-full mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <User className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button className="w-full" onClick={handleSaveProfile}>
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="statistics">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="statistics">
                <Trophy className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Game History
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statistics" className="mt-6">
              <GameStatistics />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <GameHistoryDetailed />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Achievements />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

