'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"; // Assuming `shadcn` button is used
import { Input } from "@/components/ui/input"; // For rows and columns inputs

type CellType = 'R' | 'F' | 'W' | 'V' | 0;

const BackTrackPage = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    generateMaze(rows, columns);
  }, [rows, columns]);

  const generateMaze = (rows: number, columns: number) => {
    const newGrid: CellType[][] = Array.from({ length: rows }, () =>
      Array(columns).fill(0)
    );
    newGrid[0][0] = 'R';
    newGrid[rows - 1][columns - 1] = 'F';
    setGrid(newGrid);
    setPath([]);
    setSteps(0);
  };

  const toggleWall = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      if (newGrid[row][col] === 'W') {
        newGrid[row][col] = 0;
      } else {
        newGrid[row][col] = 'W';
      }
      return newGrid;
    });
  };

  const backTrack = (
    grid: CellType[][],
    i: number,
    j: number,
    currentPath: [number, number][] = []
  ): boolean => {
    if (
      i < 0 ||
      j < 0 ||
      i >= grid.length ||
      j >= grid[0].length ||
      grid[i][j] === 'V' ||
      grid[i][j] === 'W'
    )
      return false;

    currentPath.push([i, j]);
    if (grid[i][j] === 'F') {
      setPath([...currentPath]);
      return true;
    }

    const originalValue = grid[i][j];
    grid[i][j] = 'V';

    const found =
      backTrack(grid, i + 1, j, currentPath) || // down
      backTrack(grid, i - 1, j, currentPath) || // up
      backTrack(grid, i, j + 1, currentPath) || // right
      backTrack(grid, i, j - 1, currentPath); // left

    if (!found) {
      currentPath.pop();
      grid[i][j] = originalValue;
    }
    return found;
  };

  const solveMaze = () => {
    const gridCopy = grid.map((row) => [...row]);
    const startRow = gridCopy.findIndex((row) => row.includes('R'));
    const startCol = gridCopy[startRow]?.indexOf('R') ?? -1;

    if (startRow !== -1 && startCol !== -1 && backTrack(gridCopy, startRow, startCol)) {
      setSteps(0);
    } else {
      alert("No path found");
    }
  };

  const moveRat = () => {
    if (steps >= path.length) {
      alert("Maze solved!");
      return;
    }
    setSteps((prev) => prev + 1);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Rat in a Maze</h1>
      <div className="flex space-x-2">
        <div>
          <label>Rows:</label>
          <Input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label>Columns:</label>
          <Input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            min={1}
          />
        </div>
        <Button onClick={() => generateMaze(rows, columns)}>Generate Maze</Button>
        <Button onClick={solveMaze}>Solve</Button>
      </div>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, 2.5rem)`,
          gridTemplateRows: `repeat(${rows}, 2.5rem)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`border flex items-center justify-center ${
                cell === 'W'
                  ? 'bg-black'
                  : cell === 'R'
                  ? 'bg-yellow-300'
                  : cell === 'F'
                  ? 'bg-green-300'
                  : ''
              }`}
              onClick={() => toggleWall(rowIndex, colIndex)}
            >
              {cell === 'R' && '🐭'}
              {cell === 'F' && '🍎'}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BackTrackPage;
