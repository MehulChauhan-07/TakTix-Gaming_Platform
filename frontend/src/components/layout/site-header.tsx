"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/use-Auth";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Gamepad2,
  User,
  LogOut,
  BarChart2,
  Home,
  Menu,
  X,
  Bell,
  Settings,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@lib/utils";

export function SiteHeader() {
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Example: fetch notifications on mount
  useEffect(() => {
    if (user) {
      // Mock notification fetch
      setNotificationCount(Math.floor(Math.random() * 5));
    }
  }, [user]);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Dashboard", href: "/dashboard", icon: BarChart2 },
    { name: "temp", href: "/temp", icon: ExternalLink },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Fixed: Explicitly handling the mobile menu toggle
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Taktix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Fixed: Aligned action items with proper spacing */}
        <div className="flex items-center">
          {/* Theme toggle positioned with consistent spacing */}
          <div className="mr-2">
            <ThemeToggle />
          </div>

          {/* Notification bell with consistent spacing */}
          {user && (
            <div className="mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificationCount > 0 ? (
                    Array.from({ length: notificationCount }).map((_, i) => (
                      <DropdownMenuItem key={i} className="cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium">Game Update</span>
                          <span className="text-xs text-muted-foreground">
                            New game features available!
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {isLoading ? (
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user.profilePicture ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Fixed: Mobile menu button with explicit handler */}
          <div className="ml-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation with explicit toggling */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "md:hidden border-t transition-all duration-200 ease-in-out",
          mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
        )}
      >
        <div className="container py-4 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Button
                asChild
                variant="outline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/auth/login" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild onClick={() => setMobileMenuOpen(false)}>
                <Link to="/auth/signup" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}

          {user && (
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user.profilePicture ||
                      "/placeholder.svg?height=32&width=32"
                    }
                    alt={user.username}
                  />
                  <AvatarFallback>
                    {user.username?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded-md"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded-md"
              >
                <BarChart2 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 text-sm font-medium transition-colors hover:text-primary hover:bg-accent/50 rounded-md"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
