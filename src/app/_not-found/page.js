'use client';

import { Suspense } from 'react';
import Link from 'next/link';

// This component must NOT use useSearchParams directly
function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Return to Home
      </Link>
    </div>
  );
}

// This is the main component that Next.js will use
export default function NotFoundPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}