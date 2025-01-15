"use client";

import { IoHome } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isFinish: boolean;
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
  isCurrent: boolean;
}

const RatInMaze = () => {
  const [size, setSize] = useState(3);
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const START_NODE_ROW = 0;
  const START_NODE_COL = 0;

  useEffect(() => {
    initializeGrid();
  }, [size]);

  const createNode = (row: number, col: number): Node => ({
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === size - 1 && col === size - 1,
    isWall: false,
    isPath: false,
    isVisited: false,
    isCurrent: false,
  });

  const initializeGrid = () => {
    const newGrid: Node[][] = Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => createNode(row, col))
    );
    setGrid(newGrid);
    setIsStarted(false);
  };

  const toggleWall = (row: number, col: number) => {
    if (isRunning) return;
    if ((row === 0 && col === 0) || (row === size - 1 && col === size - 1))
      return;

    setGrid(prev => 
      prev.map((rowArray, rowIndex) =>
        rowArray.map((node, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return { ...node, isWall: !node.isWall };
          }
          return node;
        })
      )
    );
  };

  const isSafe = (
    row: number,
    col: number,
    visited: boolean[][]
  ): boolean => {
    return (
      row >= 0 &&
      col >= 0 &&
      row < size &&
      col < size &&
      !grid[row][col].isWall &&
      !visited[row][col]
    );
  };

  const solveMaze = async () => {
    setIsRunning(true);
    setIsStarted(true);
    const visited: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
    await findPath(0, 0, visited);
    setIsRunning(false);
  };

  const findPath = async (
    row: number, 
    col: number, 
    visited: boolean[][]
  ): Promise<boolean> => {
    if (row === size - 1 && col === size - 1) {
      return true;
    }

    if (isSafe(row, col, visited)) {
      visited[row][col] = true;

      setGrid(prev => {
        const newGrid = prev.map(rowArray =>
          rowArray.map(node => ({ ...node, isCurrent: false }))
        );
        newGrid[row][col].isPath = true;
        newGrid[row][col].isCurrent = true;
        return newGrid;
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      const directions: [number, number][] = [
        [1, 0],  // Down
        [0, 1],  // Right
        [0, -1], // Left
        [-1, 0]  // Up
      ];

      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (await findPath(newRow, newCol, visited)) {
          return true;
        }
      }

      visited[row][col] = false;
      setGrid(prev => {
        const newGrid = prev.map(rowArray =>
          rowArray.map(node => ({ ...node }))
        );
        newGrid[row][col].isPath = false;
        newGrid[row][col].isCurrent = false;
        return newGrid;
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
      return false;
    }

    return false;
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 min-h-screen bg-gradient-to-t from-gray-600 to-gray-900">
      <nav className="w-full p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex self-start space-x-2">
            <Link href="/" className="text-white text-xl">
              <IoHome />
            </Link>
          </div>

          <h1
            className="text-2xl font-bold text-white mx-auto"
            style={{ fontFamily: "Times New Roman" }}
          >
            Rat in a Maze
          </h1>
          <div className="w-12"></div>
        </div>
      </nav>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-white">Grid Size:</label>
          <Input
            type="number"
            value={size}
            onChange={(e) =>
              setSize(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))
            }
            min="2"
            max="10"
            disabled={isRunning}
            className="w-20 px-2 py-1 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-violet-500"
          />
        </div>
        <Button
          onClick={initializeGrid}
          disabled={isRunning}
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-500 disabled:opacity-50"
        >
          Reset Grid
        </Button>
        <Button
          onClick={solveMaze}
          disabled={isRunning || isStarted}
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-500 disabled:opacity-50"
        >
          Solve Maze
        </Button>
      </div>

      <div
        className="grid p-5 gap-1 max-w-full"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(2.5rem, 1fr))`,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((node, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => toggleWall(rowIdx, colIdx)}
              className={`w-16 h-16 border border-gray-300 cursor-pointer transition-colors
                        flex items-center justify-center
                        ${node.isWall ? "bg-black" : ""}
                        ${node.isStart ? "bg-green-500" : ""}
                        ${node.isFinish ? "bg-red-500" : ""}
                        ${
                          node.isPath && !node.isStart && !node.isFinish
                            ? "bg-yellow-200"
                            : ""
                        }
                        ${node.isCurrent ? "bg-blue-400" : ""}
                      `}
            >
              {node.isStart && "🐭"}
              {node.isFinish && "🧀"}
            </div>
          ))
        )}
      </div>

      <div className="text-sm mt-4 text-white text-center">
        <p>Click on cells to create/remove walls</p>
        <p>🐭 = Start, 🧀 = End</p>
      </div>
    </div>
  );
};

export default RatInMaze;