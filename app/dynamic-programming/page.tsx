'use client';

import Link from 'next/link';

export default function DynamicProgrammingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Dynamic Programming Visualizer</h1>
      <div className="mb-8">
        <p className="text-lg text-center">Visualize dynamic programming solutions</p>
      </div>
      
      {/* Add your dynamic programming visualization components here */}
      
      <Link href="/"
            className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
