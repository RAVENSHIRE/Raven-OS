import { useCallback, useEffect, useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Hangman from "./components/games/Hangman";
import SpaceFighter from "./components/games/SpaceFighter";
import StadtLandFluss from "./components/games/Stadt-Land-Fluss";
import TicTacToe from "./components/games/TicTacToe";
import Showroom from "./components/Showroom";
import Taskbar from "./components/Taskbar";
import Window from "./components/Window";
import { OSProvider, WINDOW_TITLES, useOS } from "./context/OSContext";
import type { WindowId } from "./context/OSContext";

const BOOT_STORAGE_KEY = "raven-os-booted";

function WindowContent({ id }: { id: WindowId }) {
  const { gamesWon } = useOS();

  if (id === "showroom") {
    return <Showroom />;
  }

  if (id === "tictactoe") {
    return <TicTacToe />;
  }

  if (id === "stadtlandfluss") {
    return <StadtLandFluss />;
  }

  if (id === "spacefighter") {
    return <SpaceFighter />;
  }

  if (id === "hangman") {
    return <Hangman />;
  }

  if (id === "credits") {
    return (
      <article className="tool-window-content">
        <h2>Credits</h2>
        <p>Built by Jay Krayenbuhl with React, 98.css, and a raven-powered desktop shell.</p>
        <p>Games won: {gamesWon}/4</p>
      </article>
    );
  }

  return (
    <article className="tool-window-content floppy-secret">
      <h2>🐦‍⬛ RAVEN = KRÄHE</h2>
      <p>You've unlocked the secret archive.</p>
      <p>
        <strong>[SPECIAL PROJECT]</strong> Jay's most ambitious work, the Raven OS project itself.
      </p>
      <a
        className="floppy-secret-button"
        href="https://github.com/RAVENSHIRE/Raven-OS"
        target="_blank"
        rel="noreferrer"
      >
        Access Project →
      </a>
    </article>
  );
}

function DesktopShell() {
  const { closeWindow, focusedWindow, openWindows, windowPositions, floppyUnlocked } = useOS();

  return (
    <div className="os-shell">
      <div className="desktop-area" aria-label="Raven desktop">
        <Desktop />

        <main className="desktop-canvas" aria-label="Desktop windows">
          {openWindows.map((windowId, index) => (
            <Window
              key={windowId}
              id={windowId}
              title={windowId === "floppy" && floppyUnlocked ? "CLASSIFIED" : WINDOW_TITLES[windowId]}
              position={windowPositions[windowId]}
              zIndex={windowId === focusedWindow ? 200 : index + 10}
              className={
                windowId === "showroom"
                  ? "desktop-window-showcase"
                  : windowId === "floppy" && floppyUnlocked
                    ? "desktop-window-tool desktop-window-classified"
                    : "desktop-window-tool"
              }
              statusText={windowId === "showroom" ? "© 2026 Jay Krayenbühl" : windowId === "floppy" ? "Encrypted" : "Ready"}
              onClose={() => closeWindow(windowId)}
            >
              <WindowContent id={windowId} />
            </Window>
          ))}
        </main>
      </div>

      <Taskbar />
    </div>
  );
}

export default function App() {
  const [showBoot, setShowBoot] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem(BOOT_STORAGE_KEY) !== "1";
  });
  const [desktopVisible, setDesktopVisible] = useState(() => !showBoot);

  useEffect(() => {
    if (showBoot) {
      return;
    }

    setDesktopVisible(false);
    const timer = window.setTimeout(() => setDesktopVisible(true), 32);
    return () => window.clearTimeout(timer);
  }, [showBoot]);

  const completeBoot = useCallback(() => {
    window.sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
    setShowBoot(false);
  }, []);

  if (showBoot) {
    return <BootScreen onComplete={completeBoot} />;
  }

  return (
    <div className={`desktop-fade ${desktopVisible ? "is-visible" : ""}`.trim()}>
      <OSProvider>
        <DesktopShell />
      </OSProvider>
    </div>
  );
}
