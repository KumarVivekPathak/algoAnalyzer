'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-500 text-white p-8">
      
      <div className={`text-8xl font-bold mb-12 text-yellow-400 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-30'}`}
           style={{
             textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.8)',
             fontFamily: '"Times New Roman", Times, serif'
           }}>
        Welcome to 
      </div>
      <h1 className="text-4xl font-bold mb-8 text-center">
        Algorithm Analyzer
      </h1>

      <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
        <Link href="/sorting" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors">
          Sorting Analyzer
        </Link>
        <Link href="/backtracking"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors">
          Backtracking Visualizer
        </Link>
        {/* <Link href="/sliding-window"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors">
          Sliding Window
        </Link>
        <Link href="/dynamic-programming"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors">
          Dynamic Programming
        </Link> */}
      </div>
    </div>
  );
}
