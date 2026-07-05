import { useEffect, useRef, useState } from "react";
import { useOS } from "../../context/OSContext";

type Enemy = {
  id: string;
  x: number;
  y: number;
  alive: boolean;
};

type Bullet = {
  id: string;
  x: number;
  y: number;
};

type GameState = "playing" | "won" | "lost";

const FIELD_WIDTH = 300;
const FIELD_HEIGHT = 360;
const PLAYER_Y = FIELD_HEIGHT - 18;
const ENEMY_COUNT = 9;
const ENEMY_SIZE = 12;
const BULLET_SIZE = 4;
const PLAYER_HALF_WIDTH = 10;
const SHOOT_COOLDOWN_MS = 190;
const PLAYER_SPEED = 165;
const BULLET_SPEED = 250;
const ENEMY_SPEED = 20;

function makeWave() {
  const columns = 5;
  const spacing = FIELD_WIDTH / (columns + 1);

  return Array.from({ length: ENEMY_COUNT }, (_, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    return {
      id: `e${index}`,
      x: spacing * (col + 1),
      y: -36 - row * 26,
      alive: true,
    };
  });
}

export default function SpaceFighter() {
  const { markGameWon, wonGames } = useOS();
  const alreadyWon = wonGames.includes("spacefighter");

  const [playerX, setPlayerX] = useState(FIELD_WIDTH / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>(() => makeWave());
  const [state, setState] = useState<GameState>("playing");

  const keysRef = useRef({ left: false, right: false });
  const cooldownRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const playerXRef = useRef(FIELD_WIDTH / 2);

  const shoot = () => {
    if (state !== "playing" || cooldownRef.current > 0) {
      return;
    }

    cooldownRef.current = SHOOT_COOLDOWN_MS;
    setBullets((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        x: playerXRef.current,
        y: PLAYER_Y - 10,
      },
    ]);
  };

  useEffect(() => {
    if (state === "won" && !alreadyWon) {
      markGameWon("spacefighter");
    }
  }, [alreadyWon, markGameWon, state]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        keysRef.current.left = true;
      }

      if (event.key === "ArrowRight") {
        keysRef.current.right = true;
      }

      if (event.key.toLowerCase() === "x") {
        event.preventDefault();
        shoot();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        keysRef.current.left = false;
      }

      if (event.key === "ArrowRight") {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "playing") {
      return;
    }

    const tick = (time: number) => {
      const last = lastTimeRef.current ?? time;
      const deltaMs = Math.min(48, time - last);
      const delta = deltaMs / 1000;
      lastTimeRef.current = time;
      cooldownRef.current = Math.max(0, cooldownRef.current - deltaMs);

      let nextPlayerX = playerXRef.current;
      if (keysRef.current.left) {
        nextPlayerX -= PLAYER_SPEED * delta;
      }
      if (keysRef.current.right) {
        nextPlayerX += PLAYER_SPEED * delta;
      }

      nextPlayerX = Math.min(FIELD_WIDTH - PLAYER_HALF_WIDTH, Math.max(PLAYER_HALF_WIDTH, nextPlayerX));
      playerXRef.current = nextPlayerX;
      setPlayerX(nextPlayerX);

      setBullets((currentBullets) => {
        const movedBullets = currentBullets
          .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED * delta }))
          .filter((bullet) => bullet.y > -8);
        const survivingBulletsRef: { value: Bullet[] } = { value: movedBullets };

        setEnemies((currentEnemies) => {
          const movedEnemies = currentEnemies.map((enemy) => ({ ...enemy, y: enemy.y + ENEMY_SPEED * delta }));

          const destroyed = new Set<string>();
          const survivingBullets: Bullet[] = [];

          for (const bullet of movedBullets) {
            const hit = movedEnemies.find(
              (enemy) =>
                !destroyed.has(enemy.id) &&
                Math.abs(enemy.x - bullet.x) <= ENEMY_SIZE / 2 + BULLET_SIZE / 2 &&
                Math.abs(enemy.y - bullet.y) <= ENEMY_SIZE / 2 + BULLET_SIZE / 2
            );

            if (hit) {
              destroyed.add(hit.id);
            } else {
              survivingBullets.push(bullet);
            }
          }

          survivingBulletsRef.value = survivingBullets;

          const remaining = movedEnemies.filter((enemy) => !destroyed.has(enemy.id));
          const enemyReachedBottom = remaining.some((enemy) => enemy.y >= FIELD_HEIGHT - ENEMY_SIZE / 2);
          const enemyHitPlayer = remaining.some(
            (enemy) =>
              enemy.y >= PLAYER_Y - 10 &&
              Math.abs(enemy.x - playerXRef.current) <= PLAYER_HALF_WIDTH + ENEMY_SIZE / 2
          );

          if (enemyReachedBottom || enemyHitPlayer) {
            setState("lost");
            return remaining;
          }

          if (remaining.length === 0) {
            setState("won");
            return [];
          }

          return remaining;
        });

        return survivingBulletsRef.value;
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [state]);

  const statusText =
    state === "won"
      ? "Wave Complete! (2/4 unlocked)"
      : state === "lost"
        ? "Game Over"
        : alreadyWon
          ? "Destroy the wave again for practice."
          : "Destroy all enemies in Wave 1.";

  const reset = () => {
    keysRef.current = { left: false, right: false };
    cooldownRef.current = 0;
    playerXRef.current = FIELD_WIDTH / 2;
    setPlayerX(FIELD_WIDTH / 2);
    setBullets([]);
    setEnemies(makeWave());
    setState("playing");
  };

  const destroyedCount = ENEMY_COUNT - enemies.length;

  return (
    <div className="game-panel">
      <p className="game-status">{statusText}</p>
      <p className="game-meta">Controls: ← → move, X shoot</p>

      <div
        className="space-field"
        role="img"
        aria-label="Space Fighter game field"
        style={{ background: "#050505", border: "2px solid #7a7a7a" }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            color: "#f3f3f3",
            fontSize: "0.78rem",
            letterSpacing: "0.03em",
            fontFamily: "Courier New, monospace",
          }}
        >
          Enemies: {destroyedCount}/{ENEMY_COUNT}
        </div>

        <div
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            color: "#f3f3f3",
            fontSize: "0.78rem",
            letterSpacing: "0.03em",
            fontFamily: "Courier New, monospace",
          }}
        >
          Wave 1/1
        </div>

        <div
          style={{
            position: "absolute",
            left: playerX - PLAYER_HALF_WIDTH,
            top: PLAYER_Y - 10,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "14px solid #9fe8ff",
          }}
          aria-hidden="true"
        />

        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            style={{
              position: "absolute",
              left: enemy.x - ENEMY_SIZE / 2,
              top: enemy.y - ENEMY_SIZE / 2,
              width: ENEMY_SIZE,
              height: ENEMY_SIZE,
              background: "#ffcc66",
            }}
          />
        ))}

        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            style={{
              position: "absolute",
              left: bullet.x - BULLET_SIZE / 2,
              top: bullet.y - BULLET_SIZE / 2,
              width: BULLET_SIZE,
              height: BULLET_SIZE,
              borderRadius: "50%",
              background: "#ffffff",
            }}
          />
        ))}
      </div>

      <div className="game-actions">
        <button type="button" className="game-reset" onClick={shoot} disabled={state !== "playing"}>
          Shoot
        </button>
        <button type="button" className="game-reset" onClick={reset}>
          New Game
        </button>
      </div>
    </div>
  );
}