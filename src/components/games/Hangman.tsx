import { FormEvent, useEffect, useMemo, useState } from "react";
import { useOS } from "../../context/OSContext";

type GameState = "playing" | "won" | "lost";

const TARGET_WORD = "CARPE DIEM";
const MAX_WRONG = 6;
const ROUND_SECONDS = 15 * 60;

const DRAW_STAGES = ["", "Head", "Head + Body", "Head + Body + Left Arm", "Head + Body + Both Arms", "Head + Body + Arms + Left Leg", "Full Stickman"];

const LETTERS_IN_WORD = Array.from(new Set(TARGET_WORD.replace(/\s/g, "").split("")));

function normalizeGuess(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
}

export default function Hangman() {
  const { markGameWon, wonGames } = useOS();
  const alreadyWon = wonGames.includes("hangman");

  const [guessInput, setGuessInput] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [state, setState] = useState<GameState>("playing");

  useEffect(() => {
    if (state !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setState("lost");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (state === "won" && !alreadyWon) {
      markGameWon("hangman");
    }
  }, [alreadyWon, markGameWon, state]);

  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG && state === "playing") {
      setState("lost");
    }
  }, [state, wrongGuesses]);

  const maskedWord = useMemo(
    () =>
      TARGET_WORD.split("")
        .map((char) => {
          if (char === " ") {
            return " ";
          }

          return guessedLetters.includes(char) ? char : "_";
        })
        .join(" "),
    [guessedLetters]
  );

  useEffect(() => {
    const solved = LETTERS_IN_WORD.every((letter) => guessedLetters.includes(letter));
    if (solved && state === "playing") {
      setState("won");
    }
  }, [guessedLetters, state]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (state !== "playing") {
        return;
      }

      const guess = normalizeGuess(event.key);
      if (!guess) {
        return;
      }

      setGuessedLetters((current) => {
        if (current.includes(guess)) {
          return current;
        }

        if (!TARGET_WORD.includes(guess)) {
          setWrongGuesses((value) => value + 1);
        }

        return [...current, guess];
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state]);

  const statusText = useMemo(() => {
    if (state === "won") {
      return "You freed him! Carpe Diem! (3/4 unlocked)";
    }

    if (state === "lost") {
      return "Game Over - the stickman hangs...";
    }

    if (alreadyWon) {
      return "Unlocked already. Seize the day again.";
    }

    return "Seize the day - save the stickman from his fate.";
  }, [alreadyWon, state]);

  const submitGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state !== "playing") {
      return;
    }

    const guess = normalizeGuess(guessInput);
    setGuessInput("");

    if (!guess) {
      return;
    }

    setGuessedLetters((current) => {
      if (current.includes(guess)) {
        return current;
      }

      if (!TARGET_WORD.includes(guess)) {
        setWrongGuesses((value) => value + 1);
      }

      return [...current, guess];
    });
  };

  const reset = () => {
    setGuessInput("");
    setGuessedLetters([]);
    setWrongGuesses(0);
    setSecondsLeft(ROUND_SECONDS);
    setState("playing");
  };

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="game-panel">
      <p className="game-status">{statusText}</p>
      <p className="game-meta" aria-live="polite">
        Time left: {minutes}:{seconds} | Wrong: {wrongGuesses}/{MAX_WRONG}
      </p>

      <p className="hangman-word" aria-label="Hidden word">
        {maskedWord}
      </p>

      <p className="hangman-draw" aria-live="polite">
        Drawing: {DRAW_STAGES[Math.min(wrongGuesses, MAX_WRONG)]}
      </p>

      <form className="hangman-form" onSubmit={submitGuess}>
        <label>
          Guess a letter
          <input
            type="text"
            value={guessInput}
            onChange={(event) => setGuessInput(event.target.value)}
            maxLength={1}
            disabled={state !== "playing"}
            placeholder="A-Z"
          />
        </label>

        <div className="game-actions">
          <button type="submit" className="game-reset" disabled={state !== "playing"}>
            Guess
          </button>
          <button type="button" className="game-reset" onClick={reset}>
            New Round
          </button>
        </div>
      </form>

      <p className="game-meta">Used letters: {guessedLetters.join(", ") || "none"}</p>
    </div>
  );
}