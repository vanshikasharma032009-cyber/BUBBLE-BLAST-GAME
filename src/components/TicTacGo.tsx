import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, X, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';
import ticTacGoLogo from '../assets/images/tic_tac_go_logo_1789104573917.jpg';

interface TicTacGoProps {
  onBack: () => void;
}

export default function TicTacGo({ onBack }: TicTacGoProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const { winner, line } = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [winner]);

  useEffect(() => {
    if (!isXNext && !winner && board.includes(null)) {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((cell, index) => (cell === null ? index : null)).filter((val) => val !== null) as number[];
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        
        const newBoard = [...board];
        newBoard[randomIndex] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner]);

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const renderCellContent = (cell: string | null) => {
    if (cell === 'X') return <X className="w-12 h-12 text-pink-500" strokeWidth={4} />;
    if (cell === 'O') return <Circle className="w-10 h-10 text-cyan-400" strokeWidth={4} />;
    return null;
  };

  const renderWinningLine = () => {
    if (!line) return null;
    
    // Calculate start and end coordinates based on the line indices
    // 3x3 grid: indices 0-8
    // Layout is grid-cols-3.
    // Each cell is w-24 (96px). gap-2 is 8px.
    // Grid: 3 * 96 + 2 * 8 = 304px total
    const getCoords = (index: number) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const cellSize = 96;
      const gap = 8;
      const x = col * (cellSize + gap) + cellSize / 2;
      const y = row * (cellSize + gap) + cellSize / 2;
      return { x, y };
    };
    
    const start = getCoords(line[0]);
    const end = getCoords(line[2]);

    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          x1={start.x} y1={start.y}
          x2={end.x} y2={end.y}
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 text-white">
      <div className="absolute top-4 left-4">
        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft /> Back
        </button>
      </div>
      
      <img src={ticTacGoLogo} alt="Tic Tac Go" className="w-20 h-20 rounded-full mb-4 shadow-lg border-2 border-indigo-500" />
      <h2 className="text-3xl font-black mb-6 uppercase tracking-widest text-yellow-300">Tic Tac Go</h2>
      
      <div className="relative grid grid-cols-3 gap-2 bg-indigo-950 p-2 rounded-xl shadow-2xl">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleClick(index)}
            disabled={cell !== null || !isXNext || !!winner}
            className="w-24 h-24 bg-indigo-800 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            {renderCellContent(cell)}
          </motion.button>
        ))}
        {renderWinningLine()}
      </div>
      
      <div className="mt-8 text-xl font-bold flex items-center gap-2">
        {winner ? (
            <>Winner: {winner === 'X' ? <X className="inline w-6 h-6 text-pink-500" /> : <Circle className="inline w-6 h-6 text-cyan-400" />}</>
        ) : !board.includes(null) && !winner ? (
            <>Draw!</>
        ) : (
            <>Next: {isXNext ? <X className="inline w-6 h-6 text-pink-500" /> : <Circle className="inline w-6 h-6 text-cyan-400" />}</>
        )}
      </div>
      
      <div className="mt-4 flex gap-4">
        {winner || !board.includes(null) ? (
          <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2 bg-yellow-500 rounded-full font-bold text-indigo-950 hover:bg-yellow-400">
            <RefreshCw size={16} /> Play Again
          </button>
        ) : (
          <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2 bg-indigo-500 rounded-full font-bold text-white hover:bg-indigo-400">
            <RefreshCw size={16} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}

function calculateWinner(board: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}
