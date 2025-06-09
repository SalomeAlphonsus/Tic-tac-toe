"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const GamePage = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<number[] | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerXName, setPlayerXName] = useState("Player X");
  const [playerOName, setPlayerOName] = useState("Player O");
  const [playerXScore, setPlayerXScore] = useState(0);
  const [playerOScore, setPlayerOScore] = useState(0);
  const [xMoves, setXMoves] = useState<number[]>([]);
  const [oMoves, setOMoves] = useState<number[]>([]);
  const [mode, setMode] = useState<"solo" | "multiplayer">("solo")
  const searchParams = useSearchParams();
  const [isSoloMode, setIsSoloMode] = useState(true)
  const gameMode = searchParams.get("mode");

  const clickSound = typeof window !== 'undefined' ? new window.Audio('/sounds/click.mp3') : null;
  
  useEffect(() =>{
    const mode = searchParams.get("modes");
    setIsSoloMode(mode === "solo");
  }, [searchParams]);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  

  const calculateWinner = (newBoard: string[]) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return combo;
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (winner || board[index] !== "") return;
    if (!gameStarted) setGameStarted(true);
  
    clickSound?.play();
  
    const currentPlayer = xIsNext ? "X" : "O";
    const currentMoves = xIsNext ? [...xMoves] : [...oMoves];
    const newBoard = [...board];
  
    if (currentMoves.length >= 3) {
      const oldestMove = currentMoves.shift()!;
      newBoard[oldestMove] = "";
    }
  
    newBoard[index] = currentPlayer;
    currentMoves.push(index);
  
    setBoard(newBoard);
    if (xIsNext) {
      setXMoves(currentMoves);
    } else {
      setOMoves(currentMoves);
    }
  
    const winCombo = calculateWinner(newBoard);
    if (winCombo) {
      setWinner(winCombo);
      xIsNext
        ? setPlayerXScore((prev) => prev + 1)
        : setPlayerOScore((prev) => prev + 1);
      return;
    }
  
    const wasXTurn = xIsNext; //Store before toggling
    setXIsNext(!xIsNext);
  
    // SOLO MODE: Only let AI play if it was X's turn and solo is enabled
    if (isSoloMode && wasXTurn) {
      setTimeout(() => {
        const updatedBoard = [...newBoard];
        const available = updatedBoard
          .map((val, idx) => (val === "" ? idx : null))
          .filter((val) => val !== null) as number[];
  
        if (available.length === 0) return;
  
        const aiIndex = available[Math.floor(Math.random() * available.length)];
        const aiMoves = [...oMoves];
  
        if (aiMoves.length >= 3) {
          const oldest = aiMoves.shift()!;
          updatedBoard[oldest] = "";
        }
  
        updatedBoard[aiIndex] = "O";
        aiMoves.push(aiIndex);
  
        clickSound?.play();
  
        setBoard(updatedBoard);
        setOMoves(aiMoves);
  
        const aiWinCombo = calculateWinner(updatedBoard);
        if (aiWinCombo) {
          setWinner(aiWinCombo);
          setPlayerOScore((prev) => prev + 1);
          return;
        }
  
        setXIsNext(true);
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setXIsNext(true);
    setWinner(null);
    setGameStarted(false);
    setXMoves([]);
    setOMoves([]);
  };

  const resetScore = () => {
    setPlayerXScore(0);
    setPlayerOScore(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Tic Tac Toe</h1>
        <div className="absolute top-4 right-4 z-50">
          <details className="dropdown">
            <summary className="text-white w-6 h-6 cursor-pointer">
              <EllipsisVerticalIcon className="w-6 h-6 text-white"/>
            </summary>
            <ul className="menu dropdown-content mt-2 z-[1] p-2 shadow bg-white rounded-box w-52 text-blak">
              <li className="text-black">
                <a href="/mode-selection">Switch Game Mode</a>
              </li>
            </ul>
          </details>
        </div>
      

      <div className="flex justify-between w-full mb-4">
  <div className="flex flex-col items-center mb-6">
    <div className="px-2 py-1 rounded-xl bg-black text-white border-[1px] border-white w-40 lg:w-full flex justify-between items-center">
      <input 
        type="text" 
        value={playerXName} 
        onChange={(e) => setPlayerXName(e.target.value.trim())} 
        className="bg-black text-white focus:outline-none w-24" 
        placeholder="Player X Name" 
      />
      <span className="text-yellow-400 text-3xl font-bold">{playerXScore}</span>
    </div>
  </div>
  <div className="flex flex-col items-center">
    <div className="px-2 py-1 rounded-xl bg-black text-white border-[1px] border-white w-40 lg:w-full flex justify-between items-center">
      <input 
        type="text" 
        value={playerOName} 
        onChange={(e) => setPlayerOName(e.target.value.trim())} 
        className="bg-black text-white focus:outline-none w-24" 
        placeholder="Player O Name" 
      />
      <span className="text-yellow-400 text-3xl font-bold">{playerOScore}</span>
    </div>
  </div>
</div>
      <div className="bg-black p-4 rounded-[2rem] grid grid-cols-3 gap-3 w-72 h-72 border-[6px] border-yellow-400 shadow-[0_0_25px_#000000]">
        {board.map((cell, index) => {
          const isX = cell === "X";
          const isO = cell === "O";
          const isOldestXMove = xMoves.length >= 3 && xMoves[0] === index && xIsNext && xMoves.length + oMoves.length >= 3;
          const isOldestOMove = oMoves.length >= 3 && oMoves[0] === index && !xIsNext && xMoves.length + oMoves.length >= 3;

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`flex items-center justify-center text-5xl font-bold rounded-xl cursor-pointer transition-all duration-300 border-[3px] shadow-[0_0_8px_#ffffff90] ${winner?.includes(index) ? "animate-pulse border-[5px]" : ""
                }`}
            >
              <span
                className={`h-16 w-16 flex items-center justify-center transition="all duration-300 ${isX
                    ? isOldestXMove
                      ? "text-red-500/20"
                      : "text-red-500 drop-shadow-[0_0_10px_red]"
                    : isO
                      ? isOldestOMove
                        ? "text-cyan-400/20"
                        : "text-cyan-400 drop-shadow-[0_0_10px_cyan]"
                      : gameStarted
                        ? "text-red-500/0"
                        : "text-red-500/20"
                  }`}
              >
                {cell === "" ? (gameStarted ? "" : "X") : cell}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-5 mt-6">
      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 rounded-xl bg-black text-yellow-400 font-semibold shadow-md hover:bg-yellow-500 hover:text-black transition"
      >
        Restart Game
      </button>
      <button
        onClick={resetScore}
        className="mt-6 px-6 py-2 rounded-xl bg-black text-yellow-400 font-semibold shadow-md hover:bg-yellow-500 hover:text-black transition"
      >
        Reset Score
      </button>
      </div>
    </div>
  );
};

export default GamePage;