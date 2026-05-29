import { useEffect, useMemo, useState } from "react";
import { useOS } from "../../context/OSContext";

type Cell = "X" | "O" | null;

type Outcome = "playing" | "won" | "lost" | "draw";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function getWinner(board: Cell[]) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "draw";
  }

  return null;
}

function chooseAiMove(board: Cell[]) {
  const open = board.flatMap((cell, index) => (cell === null ? [index] : []));

  const pickBySymbol = (symbol: "X" | "O") => {
    for (const index of open) {
      const copy = [...board];
      copy[index] = symbol;
      if (getWinner(copy) === symbol) {
        return index;
      }
    }

    return null;
  };

  const winningMove = pickBySymbol("O");
  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = pickBySymbol("X");
  if (blockingMove !== null) {
    return blockingMove;
  }

  if (board[4] === null) {
    return 4;
  }

  return open[Math.floor(Math.random() * open.length)] ?? 0;
}

export default function TicTacToe() {
  const { markGameWon, gamesWon, wonGames } = useOS();
  const alreadyWon = wonGames.includes("tictactoe");

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [outcome, setOutcome] = useState<Outcome>("playing");
  const [aiTurn, setAiTurn] = useState(false);

  const statusText = useMemo(() => {
    if (outcome === "won") {
      return `You won! (${gamesWon}/4 unlocked)`;
    }

    if (outcome === "lost") {
      return "AI won this round.";
    }

    if (outcome === "draw") {
      return "Draw game.";
    }

    if (alreadyWon) {
      return `Already unlocked. Play again for fun (${gamesWon}/4).`;
    }

    return aiTurn ? "AI is thinking..." : "Your turn (X).";
  }, [aiTurn, alreadyWon, gamesWon, outcome]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setOutcome("playing");
    setAiTurn(false);
  };

  const playPlayerMove = (index: number) => {
    if (outcome !== "playing" || aiTurn || board[index]) {
      return;
    }

    const next = [...board];
    next[index] = "X";
    setBoard(next);

    const result = getWinner(next);
    if (result === "X") {
      setOutcome("won");
      markGameWon("tictactoe");
      return;
    }

    if (result === "draw") {
      setOutcome("draw");
      return;
    }

    setAiTurn(true);
  };

  useEffect(() => {
    if (!aiTurn || outcome !== "playing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setBoard((current) => {
        const move = chooseAiMove(current);
        const next = [...current];
        next[move] = "O";

        const result = getWinner(next);
        if (result === "O") {
          setOutcome("lost");
        } else if (result === "draw") {
          setOutcome("draw");
        }

        return next;
      });

      setAiTurn(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [aiTurn, outcome]);

  return (
    <div className="game-panel">
      <p className="game-status">{statusText}</p>

      <div className="tictactoe-grid" role="grid" aria-label="Tic-Tac-Toe board">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className="tictactoe-cell"
            onClick={() => playPlayerMove(index)}
            disabled={outcome !== "playing" || aiTurn || Boolean(cell)}
          >
            {cell}
          </button>
        ))}
      </div>

      <button type="button" className="game-reset" onClick={reset}>
        New Round
      </button>
    </div>
  );
}
