"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <div className="rounded-2xl border border-danger/30 bg-danger/10 p-8">
        <h2 className="text-2xl font-bold text-danger">Unexpected error</h2>
        <p className="mt-2 text-sm text-foreground">
          Something failed while loading this page. Please try again.
        </p>
        <button
          type="button"
          className="mt-4 h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-white"
          onClick={() => reset()}
        >
          Retry
        </button>
      </div>
    </main>
  );
}
