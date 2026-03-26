import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && e.key === 'Enter') {
        setIsPlaying(true);
        return;
      }
      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver, food, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 border-glitch bg-[#020202] relative shadow-[0_0_20px_var(--color-cyan)]">
      <div className="absolute top-4 left-6 text-2xl text-[var(--color-magenta)] glitch animate-text-jitter" data-text={`MEM_ALLOC:${score.toString().padStart(4, '0')}B`}>
        MEM_ALLOC:{score.toString().padStart(4, '0')}B
      </div>
      
      <div 
        className="grid bg-[#050505] border-2 border-[var(--color-cyan)] mt-12 relative overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(60vw, 450px)',
          height: 'min(60vw, 450px)'
        }}
      >
        {/* Grid lines overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(var(--color-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan) 1px, transparent 1px)',
          backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`,
          opacity: 0.1
        }}></div>

        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                w-full h-full flex items-center justify-center text-[8px] sm:text-[10px] overflow-hidden
                ${isHead ? 'bg-[var(--color-cyan)] text-black font-bold shadow-[0_0_15px_var(--color-cyan)] z-10' : ''}
                ${isSnake && !isHead ? 'memory-block opacity-80' : ''}
                ${isFood ? 'corrupted-block shadow-[0_0_15px_var(--color-magenta)]' : ''}
              `}
            >
              {isHead && 'FF'}
              {isFood && '00'}
            </div>
          );
        })}
      </div>

      {!isPlaying && !gameOver && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 overflow-hidden"
        >
          <motion.div
            initial={{ y: '-100vh', filter: 'invert(100%)' }}
            animate={{ y: 0, filter: 'invert(0%)' }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="-skew-x-12"
          >
            <div className="text-center p-12 border-glitch bg-[#050505] animate-screen-tear shadow-[0_0_40px_var(--color-cyan)]">
              <div className="skew-x-12">
                <h2 className="text-5xl mb-4 glitch text-[var(--color-cyan)] animate-text-jitter" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
                <p className="text-2xl animate-pulse text-[var(--color-magenta)]">{'>'}{'>'} PRESS [ENTER] TO EXECUTE</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {gameOver && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-20 overflow-hidden"
        >
          <motion.div
            initial={{ y: '-100vh', filter: 'hue-rotate(90deg)' }}
            animate={{ y: 0, filter: 'hue-rotate(0deg)' }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="-skew-x-12"
          >
            <div className="text-center p-12 border-glitch bg-[#050505] animate-screen-tear shadow-[0_0_50px_red]">
              <div className="skew-x-12">
                <h2 className="text-6xl mb-2 glitch text-red-500 animate-text-jitter" data-text="SEGMENTATION_FAULT">SEGMENTATION_FAULT</h2>
                <p className="text-3xl mb-8 text-[var(--color-cyan)]">BYTES_RECOVERED: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 border-2 border-[var(--color-magenta)] text-[var(--color-magenta)] hover:bg-[var(--color-magenta)] hover:text-black transition-colors text-2xl uppercase tracking-widest shadow-[0_0_15px_var(--color-magenta)]"
                >
                  {'>'}{'>'} REBOOT_SEQUENCE
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
