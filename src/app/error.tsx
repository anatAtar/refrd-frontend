'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h2>
        <p className="text-sm text-text-secondary mb-6">An unexpected error occurred.</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gold-300 hover:bg-gold-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
