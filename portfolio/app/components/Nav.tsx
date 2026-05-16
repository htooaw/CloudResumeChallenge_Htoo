'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

const NAV_ITEMS = [
  { href: '#about', label: 'About', n: '01' },
  { href: '#experience', label: 'Experience', n: '02' },
  { href: '#projects', label: 'Projects', n: '03' },
  { href: '#skills', label: 'Skills', n: '04' },
  { href: '#certs', label: 'Certs', n: '05' },
  { href: '#contact', label: 'Contact', n: '06' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink-3 bg-ink-1/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="container-prose flex h-14 items-center justify-between">
        <a
          href="#top"
          className="font-mono text-mono-sm font-medium text-bone-0 hover:text-amber-glow transition-colors"
        >
          <span className="text-amber-glow">~/</span>
          {profile.name.toLowerCase().replace(/\s+/g, '-')}
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-mono-xs text-bone-1 transition-colors hover:bg-ink-2 hover:text-bone-0"
              >
                <span className="text-amber-glow/60 group-hover:text-amber-glow">
                  {item.n}.
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resumePdf}
          target="_blank"
          rel="noopener"
          className="pill-amber hover:bg-amber-glow/15 transition-colors"
        >
          <span aria-hidden>↓</span>
          Resume
        </a>
      </nav>
    </header>
  );
}
