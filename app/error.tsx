"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div
      data-testid="error-boundary"
      className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-4"
    >
      <div className="text-center space-y-5">
        {/* Error icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Đã xảy ra lỗi!
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {error.message || "Một lỗi không mong muốn đã xảy ra. Vui lòng thử lại."}
        </p>

        <button
          data-testid="btn-retry"
          onClick={() => reset()}
          className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm hover:shadow-md transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          Thử lại
        </button>
      </div>
    </div>
  );
}
