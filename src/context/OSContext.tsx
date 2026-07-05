import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

export type WindowId =
  | "showroom"
  | "tictactoe"
  | "stadtlandfluss"
  | "spacefighter"
  | "hangman"
  | "credits"
  | "floppy";

export type GameId = "tictactoe" | "stadtlandfluss" | "spacefighter" | "hangman";

export type WindowPosition = {
  x: number;
  y: number;
};

export const WINDOW_TITLES: Record<WindowId, string> = {
  showroom: "Showroom",
  tictactoe: "Tic-Tac-Toe",
  stadtlandfluss: "Stadt, Land, Fluss",
  spacefighter: "Space Fighter",
  hangman: "Hangman (Carpe Diem)",
  credits: "Credits",
  floppy: "Floppy Disk",
};

const INITIAL_POSITIONS: Record<WindowId, WindowPosition> = {
  showroom: { x: 236, y: 40 },
  tictactoe: { x: 235, y: 72 },
  stadtlandfluss: { x: 285, y: 118 },
  spacefighter: { x: 335, y: 164 },
  hangman: { x: 385, y: 210 },
  credits: { x: 435, y: 256 },
  floppy: { x: 485, y: 132 },
};

type OSContextValue = {
  openWindows: WindowId[];
  windowPositions: Record<WindowId, WindowPosition>;
  focusedWindow: WindowId | null;
  gamesWon: number;
  floppyUnlocked: boolean;
  wonGames: GameId[];
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: WindowPosition) => void;
  markGameWon: (gameId: GameId) => void;
};

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: PropsWithChildren) {
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["showroom"]);
  const [windowPositions, setWindowPositions] = useState<Record<WindowId, WindowPosition>>(INITIAL_POSITIONS);
  const [focusedWindow, setFocusedWindow] = useState<WindowId | null>("showroom");
  const [wonGames, setWonGames] = useState<GameId[]>([]);

  const focusWindow = (id: WindowId) => {
    setOpenWindows((current) => {
      if (!current.includes(id)) {
        return current;
      }

      return [...current.filter((windowId) => windowId !== id), id];
    });
    setFocusedWindow(id);
  };

  const openWindow = (id: WindowId) => {
    setOpenWindows((current) => {
      if (current.includes(id)) {
        return [...current.filter((windowId) => windowId !== id), id];
      }

      return [...current, id];
    });

    setWindowPositions((current) => {
      if (current[id]) {
        return current;
      }

      return {
        ...current,
        [id]: { x: 128, y: 48 },
      };
    });

    setFocusedWindow(id);
  };

  const closeWindow = (id: WindowId) => {
    setOpenWindows((current) => {
      const next = current.filter((windowId) => windowId !== id);

      setFocusedWindow((activeWindow) => {
        if (activeWindow !== id) {
          return activeWindow;
        }

        return next[next.length - 1] ?? null;
      });

      return next;
    });
  };

  const moveWindow = (id: WindowId, position: WindowPosition) => {
    setWindowPositions((current) => ({
      ...current,
      [id]: position,
    }));
  };

  const markGameWon = (gameId: GameId) => {
    setWonGames((current) => {
      if (current.includes(gameId)) {
        return current;
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, gameId];
    });
  };

  const gamesWon = wonGames.length;
  const floppyUnlocked = gamesWon === 4;

  const value = useMemo(
    () => ({
      openWindows,
      windowPositions,
      focusedWindow,
      gamesWon,
      floppyUnlocked,
      wonGames,
      openWindow,
      closeWindow,
      focusWindow,
      moveWindow,
      markGameWon,
    }),
    [openWindows, windowPositions, focusedWindow, gamesWon, floppyUnlocked, wonGames]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const context = useContext(OSContext);

  if (!context) {
    throw new Error("useOS must be used inside OSProvider");
  }

  return context;
}
