import { useEffect, useMemo, useRef, useState } from "react";
import { useOS } from "../../context/OSContext";

type GameState = "playing" | "won" | "lost";
type BootState = "booting" | "fading" | "done";

type Enemy = {
  id: number;
  x: number;
  alive: boolean;
};

const BOOT_DURATION_MS = 3000;
const FADE_MS = 420;
const RUNNER_WIDTH = 360;
const PLAYER_X = 86;
const ENEMY_SPEED = 90;
const ATTACK_RANGE = 92;
const ATTACK_MS = 200;
const ENEMY_COUNT = 3;

const BOOT_LINES = [
  "DEVIL MAY CRY - JUDGMENT",
  "Initializing demonic protocol...",
  "Loading sword combat engine... OK",
  "Spawning stickman entity...",
  "Combat arena ready...",
  "SLAY OR BE SLAIN",
];

function createEnemies(): Enemy[] {
  return Array.from({ length: ENEMY_COUNT }, (_, index) => ({
    id: index,
    x: RUNNER_WIDTH + 30 + index * 84,
    alive: true,
  }));
}

export default function Hangman() {
  const { markGameWon, wonGames } = useOS();
  const alreadyWon = wonGames.includes("hangman");

  const [bootState, setBootState] = useState<BootState>("booting");
  const [bootVisibleLines, setBootVisibleLines] = useState(1);
  const [state, setState] = useState<GameState>("playing");
  const [attackActive, setAttackActive] = useState(false);
  const [runFrame, setRunFrame] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>(() => createEnemies());

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const attackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const lineStep = Math.floor(BOOT_DURATION_MS / BOOT_LINES.length);
    const lineTimer = window.setInterval(() => {
      setBootVisibleLines((current) => Math.min(BOOT_LINES.length, current + 1));
    }, lineStep);

    const bootTimer = window.setTimeout(() => {
      setBootState("fading");
      window.setTimeout(() => setBootState("done"), FADE_MS);
    }, BOOT_DURATION_MS);

    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(bootTimer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (attackTimeoutRef.current !== null) {
        window.clearTimeout(attackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state === "won" && !alreadyWon) {
      markGameWon("hangman");
    }
  }, [alreadyWon, markGameWon, state]);

  useEffect(() => {
    if (bootState !== "done" || state !== "playing") {
      return;
    }

    const loop = (time: number) => {
      const last = lastTimeRef.current ?? time;
      const delta = Math.min(0.05, (time - last) / 1000);
      lastTimeRef.current = time;

      setRunFrame((prev) => (prev + 1) % 40);
      setEnemies((current) => {
        const moved = current.map((enemy) => {
          if (!enemy.alive) {
            return enemy;
          }

          return {
            ...enemy,
            x: enemy.x - ENEMY_SPEED * delta,
          };
        });

        const touchPlayer = moved.some((enemy) => enemy.alive && enemy.x <= PLAYER_X + 10);
        if (touchPlayer) {
          setState("lost");
        }

        return moved;
      });

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [bootState, state]);

  useEffect(() => {
    if (state !== "playing") {
      return;
    }

    const remaining = enemies.filter((enemy) => enemy.alive).length;
    if (remaining === 0) {
      setState("won");
    }
  }, [enemies, state]);

  const attack = () => {
    if (state !== "playing" || bootState !== "done") {
      return;
    }

    setAttackActive(true);
    if (attackTimeoutRef.current !== null) {
      window.clearTimeout(attackTimeoutRef.current);
    }
    attackTimeoutRef.current = window.setTimeout(() => setAttackActive(false), ATTACK_MS);

    setEnemies((current) => {
      const aliveTargets = current
        .filter((enemy) => enemy.alive)
        .sort((a, b) => Math.abs(a.x - PLAYER_X) - Math.abs(b.x - PLAYER_X));

      const target = aliveTargets.find((enemy) => enemy.x >= PLAYER_X - 4 && enemy.x <= PLAYER_X + ATTACK_RANGE);
      if (!target) {
        return current;
      }

      return current.map((enemy) => (enemy.id === target.id ? { ...enemy, alive: false } : enemy));
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "x") {
        return;
      }

      event.preventDefault();
      attack();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [bootState, state]);

  const statusText = useMemo(() => {
    if (state === "won") {
      return "3/3 demons down. Arena clear. (3/4 unlocked)";
    }

    if (state === "lost") {
      return "One wrong move... he hangs in darkness.";
    }

    if (alreadyWon) {
      return "Press X to slash. Misses are only animation; enemies still kill on contact.";
    }

    return "Eliminate 3 enemies with X before they reach him.";
  }, [alreadyWon, state]);

  const aliveCount = enemies.filter((enemy) => enemy.alive).length;

  const reset = () => {
    setState("playing");
    setEnemies(createEnemies());
    setAttackActive(false);
    setRunFrame(0);
  };

  const legOffset = runFrame % 20 < 10 ? -4 : 4;

  return (
    <section
      style={{
        position: "relative",
        minHeight: 420,
        border: "1px solid #1f1f1f",
        background: "#050505",
        color: "#66ff66",
        fontFamily: "Courier New, monospace",
        padding: 12,
        overflow: "hidden",
      }}
    >
      {bootState !== "done" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            color: "#59ff59",
            display: "grid",
            alignContent: "start",
            gap: 6,
            padding: 14,
            zIndex: 20,
            opacity: bootState === "fading" ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        >
          {BOOT_LINES.slice(0, bootVisibleLines).map((line, index) => (
            <p key={line} style={{ margin: 0, fontSize: index === 0 ? "0.95rem" : "0.86rem", letterSpacing: "0.05em" }}>
              {line}
            </p>
          ))}
        </div>
      )}

      <div style={{ opacity: bootState === "done" ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}>
        <p style={{ margin: "0 0 8px", color: state === "lost" ? "#ff6a6a" : "#7cff7c", fontWeight: 700 }}>{statusText}</p>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 10 }}>
          <span>ENEMIES LEFT: {aliveCount}/{ENEMY_COUNT}</span>
          <span>CONTROL: X</span>
        </div>

        <div
          style={{
            position: "relative",
            height: 230,
            border: "1px solid #2a2a2a",
            background: state === "lost" ? "#130909" : "#0b0b0b",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.14, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, #191919 3px, #191919 4px)" }} />

          <svg width="100%" height="100%" viewBox="0 0 360 230" style={{ position: "relative", zIndex: 2 }}>
            <line x1="18" y1="194" x2="344" y2="194" stroke="#444" strokeWidth="2" />

            <g>
              <rect x="26" y="158" width="54" height="10" fill="#7f7f7f" />
              <rect x="30" y="130" width="8" height="28" fill="#7f7f7f" />
              <rect x="68" y="130" width="8" height="28" fill="#7f7f7f" />
              <rect x="34" y="168" width="6" height="24" fill="#6b6b6b" />
              <rect x="66" y="168" width="6" height="24" fill="#6b6b6b" />
            </g>

            <circle cx={PLAYER_X} cy="136" r="10" fill="none" stroke="#d9d9d9" strokeWidth="2" />
            <line x1={PLAYER_X} y1="146" x2={PLAYER_X} y2="170" stroke="#d9d9d9" strokeWidth="2" />
            <line x1={PLAYER_X} y1="154" x2={PLAYER_X - 12} y2="164" stroke="#d9d9d9" strokeWidth="2" />

            <g style={{ transformOrigin: `${PLAYER_X}px 154px`, transform: attackActive ? "rotate(-35deg)" : "rotate(0deg)", transition: "transform 120ms linear" }}>
              <line x1={PLAYER_X} y1="154" x2={PLAYER_X + 16} y2="144" stroke="#d9d9d9" strokeWidth="2" />
              <line x1={PLAYER_X + 16} y1="144" x2={PLAYER_X + 34} y2="132" stroke="#8fd6ff" strokeWidth="3" />
            </g>

            <line x1={PLAYER_X} y1="170" x2={PLAYER_X - 9} y2={188 + legOffset} stroke="#d9d9d9" strokeWidth="2" />
            <line x1={PLAYER_X} y1="170" x2={PLAYER_X + 9} y2={188 - legOffset} stroke="#d9d9d9" strokeWidth="2" />

            {enemies.map((enemy) => {
              if (!enemy.alive) {
                return null;
              }

              return (
                <g key={enemy.id}>
                  <circle cx={enemy.x} cy="140" r="9" fill="none" stroke="#ff9f9f" strokeWidth="2" />
                  <line x1={enemy.x} y1="149" x2={enemy.x} y2="171" stroke="#ff9f9f" strokeWidth="2" />
                  <line x1={enemy.x} y1="157" x2={enemy.x - 10} y2="165" stroke="#ff9f9f" strokeWidth="2" />
                  <line x1={enemy.x} y1="157" x2={enemy.x + 10} y2="165" stroke="#ff9f9f" strokeWidth="2" />
                  <line x1={enemy.x} y1="171" x2={enemy.x - 8} y2="188" stroke="#ff9f9f" strokeWidth="2" />
                  <line x1={enemy.x} y1="171" x2={enemy.x + 8} y2="188" stroke="#ff9f9f" strokeWidth="2" />
                </g>
              );
            })}

            {state === "lost" && (
              <g>
                <line x1="250" y1="44" x2="250" y2="112" stroke="#8a8a8a" strokeWidth="2" />
                <circle cx="250" cy="124" r="10" fill="none" stroke="#d0d0d0" strokeWidth="2" />
                <line x1="250" y1="134" x2="250" y2="160" stroke="#d0d0d0" strokeWidth="2" />
                <line x1="250" y1="145" x2="238" y2="153" stroke="#d0d0d0" strokeWidth="2" />
                <line x1="250" y1="145" x2="262" y2="153" stroke="#d0d0d0" strokeWidth="2" />
                <line x1="250" y1="160" x2="242" y2="179" stroke="#d0d0d0" strokeWidth="2" />
                <line x1="250" y1="160" x2="258" y2="179" stroke="#d0d0d0" strokeWidth="2" />
              </g>
            )}
          </svg>
        </div>

        <p style={{ margin: "10px 0 12px", fontSize: "0.8rem", color: "#90cf90" }}>
          Hit timing: Press X when enemies are near. Misses animate only.
        </p>

        <div className="game-actions">
          <button type="button" className="game-reset" onClick={attack} disabled={state !== "playing" || bootState !== "done"}>
            Slash (X)
          </button>
          <button type="button" className="game-reset" onClick={reset}>
            Restart Run
          </button>
        </div>
      </div>
    </section>
  );
}