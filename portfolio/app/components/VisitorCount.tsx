'use client';

import { useEffect, useState } from 'react';

type CountState = number | 'loading' | 'unavailable';

export default function VisitorCount() {
  const [count, setCount] = useState<CountState>('loading');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_VISITOR_COUNT_API;
    if (!apiUrl) {
      setCount('unavailable');
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);

    fetch(apiUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Visitor API returned ${response.status}`);
        return response.json() as Promise<{ count?: unknown }>;
      })
      .then((data) => {
        if (typeof data.count !== 'number') throw new Error('Visitor API returned an invalid count');
        setCount(data.count);
      })
      .catch(() => setCount('unavailable'))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const label = count === 'loading'
    ? 'Counting visits…'
    : count === 'unavailable'
      ? 'Visitor count unavailable'
      : `${count.toLocaleString()} visits recorded`;

  return <span aria-live="polite">{label}</span>;
}
