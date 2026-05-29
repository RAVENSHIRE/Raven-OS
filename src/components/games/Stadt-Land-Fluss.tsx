import { FormEvent, useEffect, useMemo, useState } from "react";
import { useOS } from "../../context/OSContext";
import {
  answersForLetter,
  CATEGORY_LABELS,
  isValidAnswer,
  playableLetters,
  SWISS_CATEGORIES,
  type SwissCategory,
} from "../../data/swiss-geography";

type GameState = "playing" | "won" | "lost";

const ROUND_SECONDS = 90;

type ValidationCell = {
  answer: string;
  valid: boolean;
};

type ValidationByCategory = Record<SwissCategory, ValidationCell[]>;

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createRound() {
  const letters = playableLetters();
  const letter = letters[Math.floor(Math.random() * letters.length)] ?? "B";
  const possibleCategories = SWISS_CATEGORIES.filter((category) => answersForLetter(category, letter).length >= 3);
  const categories = shuffle(possibleCategories).slice(0, 3) as [SwissCategory, SwissCategory, SwissCategory];
  const safeCategories = categories.length === 3 ? categories : (["cities", "mountains", "rivers"] as [SwissCategory, SwissCategory, SwissCategory]);

  return {
    letter,
    categories: safeCategories,
  };
}

export default function StadtLandFluss() {
  const { markGameWon, wonGames } = useOS();
  const alreadyWon = wonGames.includes("stadtlandfluss");
  const [round, setRound] = useState(createRound);

  const [answers, setAnswers] = useState<Record<SwissCategory, string[]>>({
    cities: ["", "", ""],
    mountains: ["", "", ""],
    lakes: ["", "", ""],
    rivers: ["", "", ""],
  });
  const [validation, setValidation] = useState<ValidationByCategory | null>(null);
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
      markGameWon("stadtlandfluss");
    }
  }, [alreadyWon, markGameWon, state]);

  const currentCategories = round.categories;
  const canSubmit =
    state === "playing" &&
    currentCategories.every((category) => answers[category].every((value) => value.trim().length > 0));

  const statusText = useMemo(() => {
    if (state === "won") {
      return "You won! (1/4 unlocked)";
    }

    if (state === "lost") {
      return "Game Over";
    }

    if (alreadyWon) {
      return "Unlocked already. Play again for speed.";
    }

    return "Category: Switzerland. Enter 3 valid answers per category.";
  }, [alreadyWon, state]);

  const setAnswer = (category: SwissCategory, answerIndex: number, value: string) => {
    setAnswers((current) => {
      const nextCategoryAnswers = [...current[category]];
      nextCategoryAnswers[answerIndex] = value;
      return {
        ...current,
        [category]: nextCategoryAnswers,
      };
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state !== "playing") {
      return;
    }

    const categoryValidation = {
      cities: answers.cities.map((answer) => ({ answer, valid: isValidAnswer("cities", round.letter, answer) })),
      mountains: answers.mountains.map((answer) => ({ answer, valid: isValidAnswer("mountains", round.letter, answer) })),
      lakes: answers.lakes.map((answer) => ({ answer, valid: isValidAnswer("lakes", round.letter, answer) })),
      rivers: answers.rivers.map((answer) => ({ answer, valid: isValidAnswer("rivers", round.letter, answer) })),
    } satisfies ValidationByCategory;

    setValidation(categoryValidation);

    const wonRound = currentCategories.every((category) => categoryValidation[category].every((cell) => cell.valid));

    setState(wonRound ? "won" : "lost");
  };

  const reset = () => {
    setRound(createRound());
    setAnswers({
      cities: ["", "", ""],
      mountains: ["", "", ""],
      lakes: ["", "", ""],
      rivers: ["", "", ""],
    });
    setValidation(null);
    setSecondsLeft(ROUND_SECONDS);
    setState("playing");
  };

  return (
    <div className="game-panel">
      <p className="game-status">{statusText}</p>
      <p className="game-timer" aria-live="polite">
        Letter: {round.letter} | Time left: {secondsLeft}s
      </p>

      <form className="slf-form" onSubmit={onSubmit}>
        {currentCategories.map((category) => (
          <fieldset key={category} className="slf-category-group" disabled={state !== "playing"}>
            <legend>
              {CATEGORY_LABELS[category]} ({round.letter}...)
            </legend>

            {answers[category].map((value, answerIndex) => {
              const result = validation?.[category]?.[answerIndex];

              return (
                <label key={`${category}-${answerIndex}`} className="slf-answer-row">
                  <span>{CATEGORY_LABELS[category]} #{answerIndex + 1}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => setAnswer(category, answerIndex, event.target.value)}
                    placeholder={`${round.letter}...`}
                  />
                  {validation && (
                    <span className={`slf-result-badge ${result?.valid ? "is-ok" : "is-bad"}`.trim()}>
                      {result?.valid ? "Correct" : "Wrong"}
                    </span>
                  )}
                </label>
              );
            })}
          </fieldset>
        ))}

        <div className="game-actions">
          <button type="submit" className="game-reset" disabled={!canSubmit}>
            Check Answers
          </button>
          <button type="button" className="game-reset" onClick={reset}>
            New Round
          </button>
        </div>
      </form>

      {validation && (
        <p className="game-meta" aria-live="polite">
          Correct answers: {currentCategories.reduce(
            (sum, category) => sum + validation[category].filter((item) => item.valid).length,
            0
          )}
          /{currentCategories.length * 3}
        </p>
      )}
    </div>
  );
}