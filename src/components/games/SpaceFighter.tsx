import { useEffect, useMemo, useRef, useState } from "react";
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
const PLAYER_Y = 328;
const MAX_WAVES = 4;
const ENEMY_RADIUS = 12;
const BULLET_RADIUS = 4;
const PLAYER_RADIUS = 12;
const SHOOT_COOLDOWN_MS = 140;

function makeWave(waveNumber: number) {
  const count = 3 + Math.min(2, waveNumber - 1);
  const spacing = FIELD_WIDTH / (count + 1);

  return Array.from({ length: count }, (_, index) => ({
    id: `w${waveNumber}-e${index}`,
    x: spacing * (index + 1),
    y: -40 - waveNumber * 14,
    alive: true,
  }));
}

export default function SpaceFighter() {
  const { markGameWon, wonGames } = useOS();
  const alreadyWon = wonGames.includes("spacefighter");

  const [playerX, setPlayerX] = useState(FIELD_WIDTH / 2);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>(() => makeWave(1));
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
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

      const movementPerSecond = 290;
      let nextPlayerX = playerXRef.current;

      if (keysRef.current.left) {
        nextPlayerX -= movementPerSecond * delta;
      }
      if (keysRef.current.right) {
        nextPlayerX += movementPerSecond * delta;
      }

      nextPlayerX = Math.min(FIELD_WIDTH - PLAYER_RADIUS, Math.max(PLAYER_RADIUS, nextPlayerX));
      playerXRef.current = nextPlayerX;
      setPlayerX(nextPlayerX);

      setBullets((currentBullets) => {
        const movedBullets = currentBullets
          .map((bullet) => ({ ...bullet, y: bullet.y - 420 * delta }))
          .filter((bullet) => bullet.y > -10);
        const survivingBulletsRef: { value: Bullet[] } = { value: movedBullets };

        setEnemies((currentEnemies) => {
          const movedEnemies = currentEnemies.map((enemy) => ({ ...enemy, y: enemy.y + (58 + wave * 9) * delta }));

          const shotEnemyIds = new Set<string>();
          const survivingBullets: Bullet[] = [];

          for (const bullet of movedBullets) {
            const target = movedEnemies.find(
              (enemy) =>
                !shotEnemyIds.has(enemy.id) &&
                Math.abs(enemy.x - bullet.x) <= ENEMY_RADIUS + BULLET_RADIUS &&
                Math.abs(enemy.y - bullet.y) <= ENEMY_RADIUS + BULLET_RADIUS
            );

            if (target) {
              shotEnemyIds.add(target.id);
            } else {
              survivingBullets.push(bullet);
            }
          }
          survivingBulletsRef.value = survivingBullets;

          if (shotEnemyIds.size > 0) {
            setScore((current) => current + shotEnemyIds.size);
          }

          const remaining = movedEnemies.filter((enemy) => !shotEnemyIds.has(enemy.id));
          const enemyReachedBottom = remaining.some((enemy) => enemy.y >= FIELD_HEIGHT - 18);
          const enemyHitPlayer = remaining.some(
            (enemy) => enemy.y >= PLAYER_Y - PLAYER_RADIUS && Math.abs(enemy.x - playerXRef.current) <= PLAYER_RADIUS + ENEMY_RADIUS
          );

          if (enemyReachedBottom || enemyHitPlayer) {
            setState("lost");
            return remaining;
          }

          if (remaining.length === 0) {
            if (wave >= MAX_WAVES) {
              setState("won");
              return [];
            }

            const nextWave = wave + 1;
            setWave(nextWave);
            return makeWave(nextWave);
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
  }, [state, wave]);

  const statusText = useMemo(() => {
    if (state === "won") {
      return "You saved the galaxy! (2/4 unlocked)";
    }

    if (state === "lost") {
      return "Game Over";
    }

    if (alreadyWon) {
      return "Unlocked already. Keep blasting for a high score.";
    }

    return "Clear all waves to win.";
  }, [alreadyWon, state]);

  const manualShoot = () => {
    shoot();
  };

  const reset = () => {
    keysRef.current = { left: false, right: false };
    cooldownRef.current = 0;
    playerXRef.current = FIELD_WIDTH / 2;
    setPlayerX(FIELD_WIDTH / 2);
    setBullets([]);
    setEnemies(makeWave(1));
    setWave(1);
    setScore(0);
    setState("playing");
  };

  return (
    <div className="game-panel">
      <p className="game-status">{statusText}</p>
      <p className="game-meta">
        Wave: {wave}/{MAX_WAVES} | Score: {score}
      </p>
      <p className="game-meta">Controls: ← → move, X shoot</p>

      <div className="space-field" role="img" aria-label="Space Fighter game field">
        <div className="space-player" style={{ left: playerX }}>
          ▲
        </div>

        {enemies.map((enemy) => (
          <div key={enemy.id} className="space-enemy" style={{ left: enemy.x, top: enemy.y }}>
            ✶
          </div>
        ))}

        {bullets.map((bullet) => (
          <div key={bullet.id} className="space-bullet" style={{ left: bullet.x, top: bullet.y }} />
        ))}
      </div>

      <div className="game-actions">
        <button type="button" className="game-reset" onClick={manualShoot} disabled={state !== "playing"}>
          Shoot
        </button>
        <button type="button" className="game-reset" onClick={reset}>
          New Mission
        </button>
      </div>
    </div>
  );
}