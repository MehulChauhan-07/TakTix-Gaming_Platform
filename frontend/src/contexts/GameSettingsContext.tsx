import React, { createContext, useContext, useState, useEffect } from "react";
import { GameSettings } from "../components/game/GameSettings";

interface GameSettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: GameSettings) => void;
  loading: boolean;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(
  undefined
);

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  moveSpeed: 0.5,
  theme: "system",
  autoSave: true,
  notifications: true,
  timeControl: "rapid",
};

export const GameSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("gameSettings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Error loading game settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: GameSettings) => {
    try {
      localStorage.setItem("gameSettings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving game settings:", error);
    }
  };

  return (
    <GameSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useGameSettings must be used within a GameSettingsProvider"
    );
  }
  return context;
};
