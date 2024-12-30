"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState('selection');
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(10);
  const [currentStep, setCurrentStep] = useState<{ comparing: number[], swapping: number[] } | null>(null);


  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setCurrentStep(null);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const handleArraySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 5 && value <= 50) {
      setArraySize(value);
    }
  };


  const selectionSort = async () => {
    setSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        setCurrentStep({ comparing: [minIdx, j], swapping: [] });
        await new Promise(resolve => setTimeout(resolve, speed));
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        setCurrentStep({ comparing: [], swapping: [i, minIdx] });
        await new Promise(resolve => setTimeout(resolve, speed));
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
      }
    }
    setCurrentStep(null);
    setSorting(false);
  };


  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setCurrentStep({ comparing: [j, high], swapping: [] });
      await new Promise(resolve => setTimeout(resolve, speed));

      if (arr[j] < pivot) {
        i++;
        setCurrentStep({ comparing: [], swapping: [i, j] });
        await new Promise(resolve => setTimeout(resolve, speed));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
      }
    }

    setCurrentStep({ comparing: [], swapping: [i + 1, high] });
    await new Promise(resolve => setTimeout(resolve, speed));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    return i + 1;
  };

  const quickSortHelper = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const quickSort = async () => {
    setSorting(true);
    let arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    setCurrentStep(null);
    setSorting(false);
  };

  const startSort = () => {
    if (algorithm === 'selection') {
      selectionSort();
    } else if (algorithm === 'quick') {
      quickSort();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-magenta-600 p-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
  
    <div className="flex items-center space-x-2">
      <Link href="/" className="text-white text-xl">
        Home
      </Link>
    </div>

    <h1 className="text-2xl font-bold text-white mx-auto" style={{ fontFamily: 'Times New Roman' }}>
      Sorting Visualizer
    </h1>
    <div className="w-12"></div>
  </div>
</nav>


      <div className="container mx-auto p-6">
        <Card className="bg-gray-800 border-magenta-500 mt-10 pt-10">
       
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <Select
                value={algorithm}
                onValueChange={setAlgorithm}
                disabled={sorting}
              >
                <SelectTrigger className="w-40 bg-magenta-500 text-white border-magenta-600">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent className=' bg-gray-600 text-white'>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-white">Speed:</span>
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => setSpeed(value)}
                  min={10}
                  max={1000}
                  step={10}
                  disabled={sorting}
                  className="w-32 bg-magenta-500 text-magenta-500"
      
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Size:</span>
                <Input
                  type="number"
                  value={arraySize}
                  onChange={handleArraySizeChange}
                  min={5}
                  max={50}
                  disabled={sorting}
                  className="w-20 bg-gray-700 text-white border-magenta-500"
                />
              </div>
              
              <Button 
                onClick={generateArray} 
                disabled={sorting}
                className="bg-magenta-500 hover:bg-magenta-600 text-white"
              >
                Reset Array
              </Button>
              
              <Button 
                onClick={startSort} 
                disabled={sorting}
                className="bg-magenta-500 hover:bg-magenta-600 text-white"
              >
                Start Sorting
              </Button>
            </div>

            <div className="h-64 flex items-end justify-center gap-1">
              {array.map((value, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${value}%`,
                    width: `${Math.max(100 / arraySize - 1, 4)}%`
                  }}
                  className={`
                    transition-all duration-200
                    ${currentStep?.comparing?.includes(idx)
                      ? 'bg-orange-500'
                      : currentStep?.swapping?.includes(idx)
                      ? 'bg-red-500'
                      : 'bg-yellow-400'}
                  `}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;