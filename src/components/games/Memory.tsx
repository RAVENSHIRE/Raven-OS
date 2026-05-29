import { useMemo, useState } from "react";
import { useOS } from "../../context/OSContext";

type MemoryCard = {
  id: string;
  symbol: string;
  matched: boolean;
};

const SYMBOLS = ["🪶", "💾", "🕹️", "🔧"];

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function makeDeck() {
  return shuffle(
    SYMBOLS.flatMap((symbol, idx) => [
      { id: `${symbol}-a-${idx}`, symbol, matched: false },
      { id: `${symbol}-b-${idx}`, symbol, matched: false },
    ])
  );
}

export default function Memory() {
  const { gamesWon } = useOS();

  const [cards, setCards] = useState<MemoryCard[]>(() => makeDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const allMatched = useMemo(() => cards.every((card) => card.matched), [cards]);

  const onCardClick = (index: number) => {
    if (busy || cards[index].matched || flipped.includes(index) || allMatched) {
      return;
    }

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) {
      return;
    }

    const [first, second] = nextFlipped;
    setBusy(true);

    window.setTimeout(() => {
      setCards((current) => {
        const copy = [...current];

        if (copy[first].symbol === copy[second].symbol) {
          copy[first] = { ...copy[first], matched: true };
          copy[second] = { ...copy[second], matched: true };
        }

        return copy;
      });

      setFlipped([]);
      setBusy(false);
    }, 450);
  };

  const reset = () => {
    setCards(makeDeck());
    setFlipped([]);
    setBusy(false);
  };

  return (
    <div className="game-panel">
      <p className="game-status">
        {allMatched ? `You won! (${gamesWon}/4 unlocked)` : "Match all pairs to win."}
      </p>

      <div className="memory-grid" role="grid" aria-label="Memory board">
        {cards.map((card, index) => {
          const isFaceUp = card.matched || flipped.includes(index);

          return (
            <button
              key={card.id}
              type="button"
              className="memory-card"
              onClick={() => onCardClick(index)}
              disabled={busy || card.matched || allMatched}
            >
              {isFaceUp ? card.symbol : "?"}
            </button>
          );
        })}
      </div>

      <button type="button" className="game-reset" onClick={reset}>
        New Deck
      </button>
    </div>
  );
}
