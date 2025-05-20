"use client";

/* Package System */
import { useEffect } from "react";
import Link from "next/link";

/* Package Application */

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">500 - Internal Server Error</h1>
      <p className="text-lg text-gray-600 mt-2">Something went wrong. Please try again later.</p>
      <div className="mt-4">
        <button
          onClick={reset} // Retry loading the previous page
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}