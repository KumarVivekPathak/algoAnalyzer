'use client';

import Link from 'next/link';
import React, { useState } from 'react';

const RatInMaze = () => {
    const [gridSize, setGridSize] = useState(2);
    const [maze, setMaze] = useState<number[][]>([]);
    const [path, setPath] = useState<number[][]>([]);

    const initializeMaze = (size: number) => {
        const newMaze = Array(size).fill(0).map(() => Array(size).fill(0));
        setMaze(newMaze);
        setPath([]);
    };

    const toggleWall = (x: number, y: number) => {
        const newMaze = [...maze];
        newMaze[x][y] = newMaze[x][y] === 1 ? 0 : 1; // Toggle wall
        setMaze(newMaze);
    };

    const isSafe = (x: number, y: number) => {
        return (x >= 0 && x < gridSize && y >= 0 && y < gridSize && maze[x][y] === 0);
    };

    const solveMaze = (x: number, y: number) => {
        if (x === gridSize - 1 && y === gridSize - 1) {
            setPath((prevPath) => [...prevPath, [x, y]]);
            return true;
        }

        if (isSafe(x, y)) {
            setPath((prevPath) => [...prevPath, [x, y]]);
            maze[x][y] = 2; // Mark as part of the path

            // Move right
            if (solveMaze(x, y + 1)) return true;
            // Move down
            if (solveMaze(x + 1, y)) return true;
            // Move left
            if (solveMaze(x, y - 1)) return true;
            // Move up
            if (solveMaze(x - 1, y)) return true;

            maze[x][y] = 0; // Unmark if not part of the solution
            setPath((prevPath) => prevPath.slice(0, -1));
        }
        return false;
    };

    const handleSolve = () => {
        const newMaze = [...maze];
        solveMaze(0, 0);
        setMaze(newMaze);
    };

    return (
        <div>
            <h1>Rat in the Maze</h1>
            <select onChange={(e) => initializeMaze(Number(e.target.value))}>
                <option value={2}>2x2</option>
                <option value={3}>3x3</option>
            </select>
            <button onClick={handleSolve}>Solve</button>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 50px)` }}>
                {maze.map((row, i) => (
                    row.map((cell, j) => (
                        <div key={`${i}-${j}`} style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: cell === 1 ? 'black' : (path.some(p => p[0] === i && p[1] === j) ? 'green' : (cell === 2 ? 'red' : 'white')),
                            border: '1px solid black',
                            position: 'relative',
                        }}
                            onClick={() => toggleWall(i, j)}
                        >
                            {cell === 2 ? 'RAT' : (i === gridSize - 1 && j === gridSize - 1 ? 'FOOD' : '')}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default function BacktrackingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Backtracking Visualizer</h1>
      <div className="mb-8">
        <p className="text-lg text-center">Explore backtracking algorithms in action</p>
      </div>
      
      <RatInMaze />
      
      <Link href="/"
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
