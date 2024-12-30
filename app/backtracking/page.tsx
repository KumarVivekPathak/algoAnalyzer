'use client';

import Link from 'next/link';

export default function BacktrackingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Backtracking Visualizer</h1>
      <div className="mb-8">
        <p className="text-lg text-center">Explore backtracking algorithms in action</p>
      </div>
      
      {/* Add your backtracking visualization components here */}
      
      <Link href="/"
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
