'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}
