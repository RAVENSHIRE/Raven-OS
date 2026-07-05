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

const ROUND_SECONDS = 150;

type ValidationCell = {
  answer: string;
  valid: boolean;
};

type ValidationByCategory = Record<SwissCategory, ValidationCell[]>;
type HintByCategory = Record<SwissCategory, string | null>;

function normalizeValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

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
  const [hints, setHints] = useState<HintByCategory>({
    cities: null,
    mountains: null,
    lakes: null,
    rivers: null,
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

  const allValidAnswers = useMemo(() => {
    return {
      cities: answersForLetter("cities", round.letter),
      mountains: answersForLetter("mountains", round.letter),
      lakes: answersForLetter("lakes", round.letter),
      rivers: answersForLetter("rivers", round.letter),
    } satisfies Record<SwissCategory, string[]>;
  }, [round.letter]);

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

  const useHint = (category: SwissCategory) => {
    if (state !== "playing" || hints[category]) {
      return;
    }

    const possibleAnswers = answersForLetter(category, round.letter);
    const currentNormalizedAnswers = new Set(answers[category].map((value) => normalizeValue(value)));
    const hintValue = possibleAnswers.find((entry) => !currentNormalizedAnswers.has(normalizeValue(entry))) ?? possibleAnswers[0];

    if (!hintValue) {
      return;
    }

    setHints((current) => ({
      ...current,
      [category]: hintValue,
    }));

    setAnswers((current) => {
      const nextCategoryAnswers = [...current[category]];
      const firstEmptyIndex = nextCategoryAnswers.findIndex((value) => value.trim().length === 0);

      if (firstEmptyIndex >= 0) {
        nextCategoryAnswers[firstEmptyIndex] = hintValue;
      }

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
    setHints({
      cities: null,
      mountains: null,
      lakes: null,
      rivers: null,
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

            <div className="slf-hint-row">
              <button
                type="button"
                className="game-reset slf-hint-button"
                onClick={() => useHint(category)}
                disabled={state !== "playing" || Boolean(hints[category])}
              >
                {hints[category] ? "Hint used" : `Show hint for ${CATEGORY_LABELS[category]}`}
              </button>
              {hints[category] && <span className="slf-hint-value">Hint: {hints[category]}</span>}
            </div>

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
                      {result?.valid ? "Correct ✓" : "Wrong ✗"}
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

      {validation && (
        <section className="slf-results" aria-live="polite">
          <h3>Round Results</h3>

          {currentCategories.map((category) => {
            const playerAnswers = validation[category];
            const alternatives = allValidAnswers[category].filter(
              (validAnswer) => !playerAnswers.some((item) => normalizeValue(item.answer) === normalizeValue(validAnswer))
            );

            return (
              <article key={`results-${category}`} className="slf-results-category">
                <h4>
                  {CATEGORY_LABELS[category]} ({round.letter}...)
                </h4>

                <div className="slf-results-table" role="table" aria-label={`${CATEGORY_LABELS[category]} results`}>
                  <div className="slf-results-header" role="row">
                    <strong role="columnheader">Player's answer</strong>
                    <strong role="columnheader">Result</strong>
                  </div>

                  {playerAnswers.map((item, index) => (
                    <div key={`result-${category}-${index}`} className="slf-results-row" role="row">
                      <span role="cell">{item.answer.trim() || "(empty)"}</span>
                      <span role="cell" className={item.valid ? "slf-result-ok" : "slf-result-bad"}>
                        {item.valid ? "Correct ✓" : "Wrong ✗"}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="slf-alternatives">
                  Other {CATEGORY_LABELS[category].toLowerCase()}: {alternatives.length > 0 ? alternatives.join(", ") : "No other alternatives"}
                </p>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}