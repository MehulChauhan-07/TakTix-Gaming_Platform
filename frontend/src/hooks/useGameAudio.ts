import { useEffect, useRef } from "react";
import { useGameSettings } from "../contexts/GameSettingsContext";

interface GameAudio {
  move: HTMLAudioElement;
  capture: HTMLAudioElement;
  check: HTMLAudioElement;
  gameOver: HTMLAudioElement;
  background: HTMLAudioElement;
}

export const useGameAudio = () => {
  const { settings } = useGameSettings();
  const audioRefs = useRef<GameAudio>({
    move: new Audio("/sounds/move.mp3"),
    capture: new Audio("/sounds/capture.mp3"),
    check: new Audio("/sounds/check.mp3"),
    gameOver: new Audio("/sounds/game-over.mp3"),
    background: new Audio("/sounds/background.mp3"),
  });

  useEffect(() => {
    const audio = audioRefs.current;

    // Set initial volume
    audio.move.volume = settings.soundEnabled ? 0.5 : 0;
    audio.capture.volume = settings.soundEnabled ? 0.5 : 0;
    audio.check.volume = settings.soundEnabled ? 0.5 : 0;
    audio.gameOver.volume = settings.soundEnabled ? 0.5 : 0;
    audio.background.volume = settings.musicEnabled ? 0.3 : 0;

    // Handle background music
    if (settings.musicEnabled) {
      audio.background.loop = true;
      audio.background.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    } else {
      audio.background.pause();
      audio.background.currentTime = 0;
    }

    return () => {
      // Cleanup
      Object.values(audio).forEach((audioElement) => {
        audioElement.pause();
        audioElement.currentTime = 0;
      });
    };
  }, [settings.musicEnabled]);

  useEffect(() => {
    const audio = audioRefs.current;

    // Update sound effects volume
    audio.move.volume = settings.soundEnabled ? 0.5 : 0;
    audio.capture.volume = settings.soundEnabled ? 0.5 : 0;
    audio.check.volume = settings.soundEnabled ? 0.5 : 0;
    audio.gameOver.volume = settings.soundEnabled ? 0.5 : 0;
  }, [settings.soundEnabled]);

  const playMoveSound = () => {
    if (settings.soundEnabled) {
      audioRefs.current.move.currentTime = 0;
      audioRefs.current.move.play().catch((error) => {
        console.error("Error playing move sound:", error);
      });
    }
  };

  const playCaptureSound = () => {
    if (settings.soundEnabled) {
      audioRefs.current.capture.currentTime = 0;
      audioRefs.current.capture.play().catch((error) => {
        console.error("Error playing capture sound:", error);
      });
    }
  };

  const playCheckSound = () => {
    if (settings.soundEnabled) {
      audioRefs.current.check.currentTime = 0;
      audioRefs.current.check.play().catch((error) => {
        console.error("Error playing check sound:", error);
      });
    }
  };

  const playGameOverSound = () => {
    if (settings.soundEnabled) {
      audioRefs.current.gameOver.currentTime = 0;
      audioRefs.current.gameOver.play().catch((error) => {
        console.error("Error playing game over sound:", error);
      });
    }
  };

  return {
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playGameOverSound,
  };
};
