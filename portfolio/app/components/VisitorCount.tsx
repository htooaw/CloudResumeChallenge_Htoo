'use client';

import { useState, useEffect } from 'react';

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_VISITOR_COUNT_API;
    if (!apiUrl) return;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error('Failed to fetch visitor count:', err));
  }, []);

  return (
    <>
      {count === null ? 'Loading...' : `Visitor: ${count}`}
    </>
  );
}