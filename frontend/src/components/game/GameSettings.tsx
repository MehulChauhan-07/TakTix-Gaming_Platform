import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface GameSettingsProps {
  onSave: (settings: GameSettings) => void;
  initialSettings?: GameSettings;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  moveSpeed: number;
  theme: "light" | "dark" | "system";
  autoSave: boolean;
  notifications: boolean;
  timeControl: "bullet" | "blitz" | "rapid" | "classical";
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  moveSpeed: 0.5,
  theme: "system",
  autoSave: true,
  notifications: true,
  timeControl: "rapid",
};

export const GameSettings: React.FC<GameSettingsProps> = ({
  onSave,
  initialSettings = defaultSettings,
}) => {
  const [settings, setSettings] = React.useState<GameSettings>(initialSettings);

  const handleChange = (key: keyof GameSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Game Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sound">Sound Effects</Label>
          <Switch
            id="sound"
            checked={settings.soundEnabled}
            onCheckedChange={(checked: boolean) =>
              handleChange("soundEnabled", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="music">Background Music</Label>
          <Switch
            id="music"
            checked={settings.musicEnabled}
            onCheckedChange={(checked: boolean) =>
              handleChange("musicEnabled", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Move Animation Speed</Label>
          <Slider
            value={[settings.moveSpeed]}
            onValueChange={([value]: number[]) =>
              handleChange("moveSpeed", value)
            }
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value: "light" | "dark" | "system") =>
              handleChange("theme", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoSave">Auto-save Games</Label>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked: boolean) =>
              handleChange("autoSave", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Game Notifications</Label>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked: boolean) =>
              handleChange("notifications", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Time Control</Label>
          <Select
            value={settings.timeControl}
            onValueChange={(
              value: "bullet" | "blitz" | "rapid" | "classical"
            ) => handleChange("timeControl", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bullet">Bullet (1 min)</SelectItem>
              <SelectItem value="blitz">Blitz (3 min)</SelectItem>
              <SelectItem value="rapid">Rapid (10 min)</SelectItem>
              <SelectItem value="classical">Classical (30 min)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </Card>
  );
};
