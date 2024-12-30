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

  const bubbleSort = async () => {
    setSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setCurrentStep({ comparing: [j, j + 1], swapping: [] });
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (arr[j] > arr[j + 1]) {
          setCurrentStep({ comparing: [], swapping: [j, j + 1] });
          await new Promise(resolve => setTimeout(resolve, speed));
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
    }
    setCurrentStep(null);
    setSorting(false);
  };

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      setCurrentStep({ comparing: [left + i, mid + 1 + j], swapping: [] });
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (L[i] <= R[j]) {
        setCurrentStep({ comparing: [], swapping: [k] });
        arr[k] = L[i];
        i++;
      } else {
        setCurrentStep({ comparing: [], swapping: [k] });
        arr[k] = R[j];
        j++;
      }
      setArray([...arr]);
      k++;
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    while (i < n1) {
      setCurrentStep({ comparing: [], swapping: [k] });
      arr[k] = L[i];
      i++;
      k++;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    while (j < n2) {
      setCurrentStep({ comparing: [], swapping: [k] });
      arr[k] = R[j];
      j++;
      k++;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  };

  const mergeSortHelper = async (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      await mergeSortHelper(arr, left, mid);
      await mergeSortHelper(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const mergeSort = async () => {
    setSorting(true);
    let arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setCurrentStep(null);
    setSorting(false);
  };

  const insertionSort = async () => {
    setSorting(true);
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        setCurrentStep({ comparing: [j, i], swapping: [] });
        await new Promise(resolve => setTimeout(resolve, speed));
        arr[j + 1] = arr[j];
        j--;
      }
      setCurrentStep({ comparing: [], swapping: [j + 1] });
      await new Promise(resolve => setTimeout(resolve, speed));
      arr[j + 1] = key;
      setArray([...arr]);
    }
    setCurrentStep(null);
    setSorting(false);
  };

  const heapify = (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };

  const heapSort = async () => {
    setSorting(true);
    let arr = [...array];
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      setCurrentStep({ comparing: [], swapping: [0, i] });
      await new Promise(resolve => setTimeout(resolve, speed));
      [arr[0], arr[i]] = [arr[i], arr[0]];
      heapify(arr, i, 0);
      setArray([...arr]);
    }
    setCurrentStep(null);
    setSorting(false);
  };

  const startSort = () => {
    if (algorithm === 'selection') {
      selectionSort();
    } else if (algorithm === 'quick') {
      quickSort();
    }else if (algorithm === 'merge') {
      mergeSort();
    }else if (algorithm === 'bubble') {
      bubbleSort();
    }else if (algorithm === 'insertion') {
      insertionSort();
    }else if (algorithm === 'heap') {
      heapSort();
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
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="heap">Heap Sort</SelectItem>
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