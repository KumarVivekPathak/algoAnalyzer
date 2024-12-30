'use client';

import Link from 'next/link';

export default function SlidingWindowPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Sliding Window Visualizer</h1>
      <div className="mb-8">
        <p className="text-lg text-center">Understand sliding window algorithm patterns</p>
      </div>
      
      {/* Add your sliding window visualization components here */}
      
      <Link href="/"
            className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
