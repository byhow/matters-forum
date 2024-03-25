"use client"; // Error components must be Client Components

import { useLogger } from "next-axiom";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const log = useLogger();
  useEffect(() => {
    // Log the error to an error reporting service
    log.error(`Error fetching the feed`, error);
  }, [error, log]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
