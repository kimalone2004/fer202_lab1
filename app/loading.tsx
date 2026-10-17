export default function Loading() {
  return (
    <div
      data-testid="loading"
      className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-zinc-200 dark:border-zinc-800" />
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
          Đang tải...
        </p>
      </div>
    </div>
  );
}
