import { useEffect, useRef, useState } from "react";
import StartMenu from "./StartMenu";
import { WINDOW_TITLES, useOS } from "../context/OSContext";

export default function Taskbar() {
  const { openWindows, focusedWindow, focusWindow } = useOS();
  const [startOpen, setStartOpen] = useState(false);
  const taskbarRef = useRef<HTMLElement | null>(null);
  const [clock, setClock] = useState(() =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date())
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!startOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!taskbarRef.current?.contains(event.target as Node)) {
        setStartOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [startOpen]);

  const handleShutdown = () => {
    window.sessionStorage.removeItem("raven-os-booted");
    window.location.reload();
  };

  const handleReboot = () => {
    window.location.reload();
  };

  return (
    <footer className="taskbar" ref={taskbarRef}>
      <button
        type="button"
        className="taskbar-start"
        onClick={() => setStartOpen((prev) => !prev)}
        title="Open Start menu"
        aria-haspopup="menu"
        aria-expanded={startOpen}
      >
        <span className="taskbar-start-logo" aria-hidden="true">
          ◼
        </span>
        <span>Start</span>
      </button>

      {startOpen && (
        <StartMenu
          onShutdown={handleShutdown}
          onReboot={handleReboot}
          onClose={() => setStartOpen(false)}
        />
      )}

      <div className="taskbar-windows" aria-label="Open windows">
        {openWindows.map((windowId) => (
          <button
            key={windowId}
            type="button"
            className={`taskbar-window-button ${focusedWindow === windowId ? "is-active" : ""}`.trim()}
            onClick={() => focusWindow(windowId)}
          >
            {WINDOW_TITLES[windowId]}
          </button>
        ))}
      </div>

      <div className="taskbar-clock" aria-label="Current time">
        {clock}
      </div>
    </footer>
  );
}
