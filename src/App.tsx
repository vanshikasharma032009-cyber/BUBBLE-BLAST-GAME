/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';

import { BlockShape, GridCell, GameState, FloatingText } from './types';
import { generateThreeShapes, canShapeFit } from './shapes';
import { soundManager } from './audio';

import BackButton from './components/BackButton';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import BlockTray from './components/BlockTray';
import FloatingDragBlock from './components/FloatingDragBlock';
import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';
import GameOverModal from './components/GameOverModal';
import SnakeLevelMap, { getLevelTargetScore } from './components/SnakeLevelMap';
import LevelSuccessModal from './components/LevelSuccessModal';
import TicTacGo from './components/TicTacGo';

const GRID_SIZE = 8;

const createEmptyGrid = (): GridCell[][] =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({ filled: false }))
    );

export default function App() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('block_blast_high_score');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Level Progression States (1 to 150 levels)
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('block_blast_current_level');
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('block_blast_unlocked_level');
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('block_blast_level_stars');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  const totalStars = useMemo(() => {
    return Object.values(levelStars).reduce((acc: number, curr: number) => acc + curr, 0);
  }, [levelStars]);

  const [hasClearedLevel, setHasClearedLevel] = useState(false);

  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const [availableBlocks, setAvailableBlocks] = useState<(BlockShape | null)[]>(() => generateThreeShapes(undefined, difficulty));
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  // Ref tracking current blocks to guarantee zero stale closure issues
  const availableBlocksRef = useRef<(BlockShape | null)[]>(availableBlocks);
  useEffect(() => {
    availableBlocksRef.current = availableBlocks;
  }, [availableBlocks]);

  // Drag state
  const [dragState, setDragState] = useState<{
    index: number;
    block: BlockShape;
    pointerX: number;
    pointerY: number;
    isTouch: boolean;
    startX: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);

  const [ghostPreview, setGhostPreview] = useState<{
    startRow: number;
    startCol: number;
    shape: BlockShape;
    isValid: boolean;
  } | null>(null);

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;
  const ghostPreviewRef = useRef(ghostPreview);
  ghostPreviewRef.current = ghostPreview;

  // Auto-replenish guard: If all blocks are ever consumed in the tray, immediately spawn 3 new blocks
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'gameover' || gameState === 'levelcomplete') {
      const activeCount = availableBlocks.filter((b): b is BlockShape => Boolean(b)).length;
      if (activeCount === 0) {
        const fresh = generateThreeShapes(grid, difficulty);
        availableBlocksRef.current = fresh;
        setAvailableBlocks(fresh);
      }
    }
  }, [availableBlocks, gameState, grid]);

  // Sync high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('block_blast_high_score', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (gameState === 'tictacgo-loading') {
      const timer = setTimeout(() => {
        setGameState('tictacgo');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Floating text creator
  const addFloatingText = useCallback((text: string, x = 50, y = 50, color = 'text-yellow-300') => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  }, []);

  // Manual reroll / refresh blocks on tray
  const handleRerollBlocks = useCallback(() => {
    soundManager.playLevelClick();
    const fresh = generateThreeShapes(grid, difficulty);
    availableBlocksRef.current = fresh;
    setAvailableBlocks(fresh);
    setSelectedBlockIndex(null);
    addFloatingText('3 New Blocks! ✨', 50, 65, 'text-cyan-300');
  }, [grid, addFloatingText, difficulty]);

  // Flow handlers: 1st loading -> 2nd start (tap to play) -> 3rd levels/playing
  const handleLoadingComplete = () => {
    setGameState('start');
  };

  const handleTapToPlay = () => {
    soundManager.playBackgroundMusic();
    resetGameData('playing');
  };

  const hasClearedLevelRef = useRef(hasClearedLevel);
  useEffect(() => {
    hasClearedLevelRef.current = hasClearedLevel;
  }, [hasClearedLevel]);

  const resetGameData = useCallback((targetState: GameState = 'playing') => {
    setGrid(createEmptyGrid());
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalLinesCleared(0);
    setSelectedBlockIndex(null);
    setGhostPreview(null);
    setDragState(null);
    const fresh = generateThreeShapes(undefined, difficulty);
    availableBlocksRef.current = fresh;
    setAvailableBlocks(fresh);
    setHasClearedLevel(false);
    hasClearedLevelRef.current = false;
    setGameState(targetState);
  }, []);

  const handleSelectLevel = (lvl: number) => {
    setCurrentLevel(lvl);
    localStorage.setItem('block_blast_current_level', lvl.toString());
    resetGameData('playing');
  };

  const handleRestartGame = () => {
    resetGameData('playing');
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Check game over condition
  const checkGameOver = useCallback(
    (currentGrid: GridCell[][], blocks: (BlockShape | null)[]) => {
      const activeBlocks = blocks.filter((b): b is BlockShape => b !== null);
      if (activeBlocks.length === 0) return false;

      const canAnyFit = activeBlocks.some((shape) =>
        canShapeFit(shape, currentGrid, GRID_SIZE)
      );

      return !canAnyFit;
    },
    []
  );

  const handleLevelAchieved = useCallback((finalScore: number) => {
    setHasClearedLevel(true);
    hasClearedLevelRef.current = true;
    const targetScore = getLevelTargetScore(currentLevel);
    const ratio = finalScore / targetScore;
    const earnedStars = ratio >= 1.6 ? 3 : ratio >= 1.25 ? 2 : 1;

    setLevelStars((prev) => {
      const updated = {
        ...prev,
        [currentLevel]: Math.max(prev[currentLevel] || 0, earnedStars)
      };
      localStorage.setItem('block_blast_level_stars', JSON.stringify(updated));
      return updated;
    });

    const nextLvl = Math.min(150, currentLevel + 1);
    setUnlockedLevel((prev) => {
      const updated = Math.max(prev, nextLvl);
      localStorage.setItem('block_blast_unlocked_level', updated.toString());
      return updated;
    });

    try {
      confetti({
        particleCount: 75,
        spread: 100,
        origin: { y: 0.4 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setGameState('levelcomplete');
    }, 450);
  }, [currentLevel]);

  // Execute Block Placement
  const executePlacement = useCallback(
    (startRow: number, startCol: number, shape: BlockShape, blockIndex: number) => {
      const rows = shape.matrix.length;
      const cols = shape.matrix[0].length;

      // Validate placement once more
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (shape.matrix[r][c] === 1) {
            const targetR = startRow + r;
            const targetC = startCol + c;
            if (
              targetR < 0 ||
              targetR >= GRID_SIZE ||
              targetC < 0 ||
              targetC >= GRID_SIZE ||
              grid[targetR][targetC].filled
            ) {
              return false;
            }
          }
        }
      }

      // 1. Fill the cells
      const nextGrid: GridCell[][] = grid.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      let cellCount = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (shape.matrix[r][c] === 1) {
            nextGrid[startRow + r][startCol + c] = {
              filled: true,
              color: shape.color
            };
            cellCount++;
          }
        }
      }

      // 2. Check full rows and cols
      const fullRows: number[] = [];
      const fullCols: number[] = [];

      for (let r = 0; r < GRID_SIZE; r++) {
        if (nextGrid[r].every((cell) => cell.filled)) {
          fullRows.push(r);
        }
      }

      for (let c = 0; c < GRID_SIZE; c++) {
        let isColFull = true;
        for (let r = 0; r < GRID_SIZE; r++) {
          if (!nextGrid[r][c].filled) {
            isColFull = false;
            break;
          }
        }
        if (isColFull) {
          fullCols.push(c);
        }
      }

      const linesCleared = fullRows.length + fullCols.length;
      const placementPoints = cellCount * 10;

      // 3. Update Available Blocks using ref for guaranteed synchronization
      const curTray = availableBlocksRef.current.length === 3
        ? [...availableBlocksRef.current]
        : generateThreeShapes();

      curTray[blockIndex] = null;
      const remainingCount = curTray.filter((b): b is BlockShape => Boolean(b)).length;

      // If all blocks are placed, generate 3 smart shapes that fit the future board if possible
      const previewBoardForGen = linesCleared > 0
        ? nextGrid.map((row, r) =>
            row.map((cell, c) => {
              if (fullRows.includes(r) || fullCols.includes(c)) return { filled: false };
              return cell;
            })
          )
        : nextGrid;

      const updatedBlocks = remainingCount === 0
        ? generateThreeShapes(previewBoardForGen)
        : curTray;

      // Update ref and state immediately so UI stays in lockstep
      availableBlocksRef.current = updatedBlocks;
      setAvailableBlocks(updatedBlocks);
      setSelectedBlockIndex(null);

      if (remainingCount === 0) {
        soundManager.playLevelClick();
        addFloatingText('3 New Blocks! 🌟', 50, 60, 'text-emerald-300');
      }

      if (linesCleared > 0) {
        // Mark cells for clearing animation
        for (const r of fullRows) {
          for (let c = 0; c < GRID_SIZE; c++) {
            nextGrid[r][c].isClearing = true;
          }
        }
        for (const c of fullCols) {
          for (let r = 0; r < GRID_SIZE; r++) {
            nextGrid[r][c].isClearing = true;
          }
        }

        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo((prev) => Math.max(prev, newCombo));
        setTotalLinesCleared((prev) => prev + linesCleared);

        const linePoints = Math.round(linesCleared * 120 * (1 + (newCombo - 1) * 0.4));
        const totalPointsGained = placementPoints + linePoints;
        const newScore = score + totalPointsGained;
        setScore(newScore);

        // Sound & FX
        soundManager.playClear(linesCleared, newCombo);
        soundManager.playBlastVoice();
        if (newCombo >= 2) {
          soundManager.playCombo(newCombo);
        }

        if (linesCleared >= 1) {
          try {
            confetti({
              particleCount: 30 * linesCleared + (newCombo > 1 ? 25 : 0),
              spread: 70,
              colors: ['#38bdf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24', '#fb7185', '#60a5fa'],
              origin: { y: 0.5 }
            });
          } catch {
            // ignore
          }
        }

        // Floating text with celebratory titles
        if (newCombo >= 2) {
          addFloatingText(`${newCombo}x COMBO! 🔥 +${totalPointsGained}`, 50, 45, 'text-amber-300');
        } else if (linesCleared >= 3) {
          addFloatingText(`TRIPLE BLAST! ⚡ +${totalPointsGained}`, 50, 45, 'text-fuchsia-300');
        } else if (linesCleared === 2) {
          addFloatingText(`DOUBLE BLAST! 💥 +${totalPointsGained}`, 50, 45, 'text-cyan-300');
        } else {
          addFloatingText(`BLAST! ✨ +${totalPointsGained}`, 50, 45, 'text-sky-300');
        }

        setGrid(nextGrid);

        // After blast animation completes, clear the cells and evaluate next state
        setTimeout(() => {
          const clearedGrid: GridCell[][] = nextGrid.map((row, r) =>
            row.map((cell, c) => {
              if (fullRows.includes(r) || fullCols.includes(c)) {
                return { filled: false };
              }
              return { ...cell, isClearing: false };
            })
          );
          setGrid(clearedGrid);

          // Check level goal completion
          const targetScore = getLevelTargetScore(currentLevel);
          if (newScore >= targetScore && !hasClearedLevelRef.current) {
            handleLevelAchieved(newScore);
          } else {
            // Check game over on the cleaned grid
            if (checkGameOver(clearedGrid, updatedBlocks)) {
              soundManager.playGameOver();
              setGameState('gameover');
            }
          }
        }, 220);
      } else {
        // No lines cleared
        setCombo(0);
        const newScore = score + placementPoints;
        setScore(newScore);
        soundManager.playPlace();
        addFloatingText(`+${placementPoints}`, 50, 50, 'text-white');

        setGrid(nextGrid);

        // Check level goal completion
        const targetScore = getLevelTargetScore(currentLevel);
        if (newScore >= targetScore && !hasClearedLevelRef.current) {
          handleLevelAchieved(newScore);
        } else {
          // Check game over
          if (checkGameOver(nextGrid, updatedBlocks)) {
            soundManager.playGameOver();
            setGameState('gameover');
          }
        }
      }

      soundManager.playTuneStep(0); // Add tuning sound
      return true;
    },
    [grid, availableBlocks, combo, addFloatingText, checkGameOver, currentLevel, score, handleLevelAchieved]
  );

  // Tap-to-select in tray
  const handleBlockSelect = (index: number) => {
    if (availableBlocks[index]) {
      if (selectedBlockIndex === index) {
        setSelectedBlockIndex(null);
      } else {
        setSelectedBlockIndex(index);
        soundManager.playPickup();
      }
    }
  };

  // Tap-to-place on grid cell
  const handleCellClick = (r: number, c: number) => {
    if (selectedBlockIndex === null) return;
    const block = availableBlocks[selectedBlockIndex];
    if (!block) return;

    // Check if it can be placed starting at (r, c)
    const success = executePlacement(r, c, block, selectedBlockIndex);
    if (!success) {
      addFloatingText("Doesn't fit here!", 50, 50, 'text-rose-400');
    }
  };

  // Drag handlers
  const handleBlockPointerDown = (e: React.PointerEvent, index: number) => {
    const block = availableBlocks[index];
    if (!block) return;

    // Prevent default touch gestures (scrolling)
    e.preventDefault();

    const isTouch = e.pointerType === 'touch';
    soundManager.playPickup();

    setDragState({
      index,
      block,
      pointerX: e.clientX,
      pointerY: e.clientY,
      isTouch,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false
    });

    setSelectedBlockIndex(index);
  };

  // Global window pointer listeners for butter-smooth dragging
  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const curDrag = dragStateRef.current;
      if (!curDrag) return;

      const deltaX = Math.abs(e.clientX - curDrag.startX);
      const deltaY = Math.abs(e.clientY - curDrag.startY);
      const hasMoved = curDrag.hasMoved || deltaX > 6 || deltaY > 6;

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              pointerX: e.clientX,
              pointerY: e.clientY,
              hasMoved
            }
          : null
      );

      // Compute board snap preview
      if (!gridRef.current) return;
      const boardRect = gridRef.current.getBoundingClientRect();
      const cellSize = boardRect.width / GRID_SIZE;

      // On touch, offset shape above finger so thumb does not cover the block!
      const targetX = e.clientX;
      const targetY = curDrag.isTouch ? e.clientY - 70 : e.clientY;

      const shapeRows = curDrag.block.matrix.length;
      const shapeCols = curDrag.block.matrix[0].length;

      // Center the shape under target coordinates
      const anchorCol = Math.round((targetX - boardRect.left - (shapeCols * cellSize) / 2) / cellSize);
      const anchorRow = Math.round((targetY - boardRect.top - (shapeRows * cellSize) / 2) / cellSize);

      // Check if within bounds
      if (
        anchorRow >= 0 &&
        anchorRow + shapeRows <= GRID_SIZE &&
        anchorCol >= 0 &&
        anchorCol + shapeCols <= GRID_SIZE
      ) {
        // Check collision
        let isValid = true;
        for (let r = 0; r < shapeRows; r++) {
          for (let c = 0; c < shapeCols; c++) {
            if (curDrag.block.matrix[r][c] === 1) {
              if (grid[anchorRow + r][anchorCol + c].filled) {
                isValid = false;
                break;
              }
            }
          }
          if (!isValid) break;
        }

        setGhostPreview({
          startRow: anchorRow,
          startCol: anchorCol,
          shape: curDrag.block,
          isValid
        });
      } else if (
        targetX >= boardRect.left - 40 &&
        targetX <= boardRect.right + 40 &&
        targetY >= boardRect.top - 40 &&
        targetY <= boardRect.bottom + 40
      ) {
        // Partly overlapping the board
        setGhostPreview({
          startRow: anchorRow,
          startCol: anchorCol,
          shape: curDrag.block,
          isValid: false
        });
      } else {
        setGhostPreview(null);
      }
    };

    const handlePointerUp = () => {
      const curDrag = dragStateRef.current;
      const curGhost = ghostPreviewRef.current;

      if (curDrag) {
        if (curDrag.hasMoved && curGhost && curGhost.isValid) {
          executePlacement(
            curGhost.startRow,
            curGhost.startCol,
            curDrag.block,
            curDrag.index
          );
        } else if (!curDrag.hasMoved) {
          // Just a tap - block is selected for tap-to-place
          setSelectedBlockIndex(curDrag.index);
        }
      }

      setDragState(null);
      setGhostPreview(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, grid, executePlacement]);

  // Compute cellSize for floating lifted block
  const boardWidth = gridRef.current?.clientWidth || 360;
  const dynamicCellSize = Math.max(28, Math.floor((boardWidth - 28) / 8));

  return (
    <div
      className={`min-h-screen bg-slate-950 text-white flex flex-col items-center relative select-none ${
        gameState === 'levels'
          ? 'p-0 justify-start overflow-hidden'
          : 'p-3 sm:p-5 justify-center overflow-hidden touch-none'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* 1st Page: Loading Screen with 3D Logo & Progress */}
        {gameState === 'loading' && (
          <LoadingScreen
            key="loading"
            onComplete={handleLoadingComplete}
          />
        )}

        {/* 2nd Page: Dedicated Tap to Play Screen with 3D Logo */}
        {gameState === 'start' && (
          <StartScreen
            key="start"
            highScore={highScore}
            currentLevel={currentLevel}
            totalStars={totalStars}
            isMuted={isMuted}
            difficulty={difficulty}
            onToggleMute={handleToggleSound}
            onTapToPlay={handleTapToPlay}
            onOpenLevelMap={() => setGameState('levels')}
            onOpenTicTacGo={() => setGameState('tictacgo-loading')}
            onSetDifficulty={setDifficulty}
          />
        )}

        {/* 3rd Page: Snake Level Map (Levels 1 to 150) */}
        {gameState === 'levels' && (
          <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-50">
              <BackButton onClick={() => setGameState('start')} />
            </div>
            <SnakeLevelMap
              key="levels"
              unlockedLevel={unlockedLevel}
              levelStars={levelStars}
              onSelectLevel={handleSelectLevel}
              onBackToLoading={() => setGameState('start')}
              isMuted={isMuted}
              onToggleSound={handleToggleSound}
            />
          </div>
        )}

        {/* 3rd Page: Play Game Screen */}
        {(gameState === 'playing' || gameState === 'gameover' || gameState === 'levelcomplete') && (
          <div key="game" className="w-full max-w-md flex flex-col items-center">
            <BackButton onClick={() => setGameState('start')} />
            {/* Header / Score / Controls with Level Target */}
            <ScoreBoard
              score={score}
              highScore={highScore}
              combo={combo}
              isMuted={isMuted}
              currentLevel={currentLevel}
              targetScore={getLevelTargetScore(currentLevel)}
              onToggleSound={handleToggleSound}
              onRestart={handleRestartGame}
              onOpenTuner={() => setGameState('loading')}
              onOpenMap={() => setGameState('levels')}
            />

            {/* 8x8 Board */}
            <GameBoard
              grid={grid}
              gridRef={gridRef}
              ghostPreview={ghostPreview}
              floatingTexts={floatingTexts}
              onCellClick={handleCellClick}
            />

            {/* Block Tray (Drag or tap to place) */}
            <BlockTray
              availableBlocks={availableBlocks}
              selectedBlockIndex={selectedBlockIndex}
              draggingIndex={dragState?.index ?? null}
              onBlockPointerDown={handleBlockPointerDown}
              onBlockSelect={handleBlockSelect}
              onReroll={handleRerollBlocks}
            />
          </div>
        )}
          {/* 4th Page: Tic Tac Go */}
        {gameState === 'tictacgo-loading' && (
          <div key="tictacgo-loading" className="flex flex-col items-center justify-center min-h-screen">
             <div className="text-2xl font-black text-white mb-4">Loading Tic Tac Go...</div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               className="w-12 h-12 border-4 border-t-yellow-500 border-indigo-500 rounded-full"
             />
          </div>
        )}
        {gameState === 'tictacgo' && (
          <TicTacGo onBack={() => setGameState('start')} />
        )}
      </AnimatePresence>

      {/* Floating lifted block during drag */}
      {dragState && (
        <FloatingDragBlock
          shape={dragState.block}
          x={dragState.pointerX}
          y={dragState.isTouch ? dragState.pointerY - 70 : dragState.pointerY}
          cellSize={dynamicCellSize}
        />
      )}

      {/* Level Complete Modal */}
      {gameState === 'levelcomplete' && (
        <LevelSuccessModal
          level={currentLevel}
          score={score}
          targetScore={getLevelTargetScore(currentLevel)}
          stars={
            score >= getLevelTargetScore(currentLevel) * 1.6
              ? 3
              : score >= getLevelTargetScore(currentLevel) * 1.25
              ? 2
              : 1
          }
          onNextLevel={() => handleSelectLevel(Math.min(150, currentLevel + 1))}
          onGoToMap={() => setGameState('levels')}
          onReplay={() => handleSelectLevel(currentLevel)}
          onContinue={() => setGameState('playing')}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          score={score}
          highScore={highScore}
          isNewHighScore={score >= highScore && score > 0}
          totalLinesCleared={totalLinesCleared}
          maxCombo={maxCombo}
          level={currentLevel}
          targetScore={getLevelTargetScore(currentLevel)}
          onRestart={handleRestartGame}
          onGoToMap={() => setGameState('levels')}
        />
      )}
    </div>
  );
}
