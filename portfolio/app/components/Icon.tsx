import type { ReactNode } from 'react';

type IconName =
  | 'home'
  | 'user'
  | 'layers'
  | 'briefcase'
  | 'tool'
  | 'mail'
  | 'arrow'
  | 'download'
  | 'external'
  | 'git';

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
    tool: <><path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.4 7.2 6.1 4.9a4 4 0 0 0 5 5L4 17l3 3 7.1-7.1a4 4 0 0 0 5-5L16.8 10 13.2 6.4l1.5-1.5Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></>,
    external: <><path d="M14 3h7v7M10 14 21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/></>,
    git: <><circle cx="12" cy="12" r="9"/><path d="M9 15c-3 .9-3-1.5-4-2M15 18v-2.3c0-.7-.3-1.3-.7-1.7 2.3-.3 4.7-1.1 4.7-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.8-.3-2.8 1a9.5 9.5 0 0 0-5 0c-2-1.3-2.8-1-2.8-1a3.6 3.6 0 0 0-.1 2.7A3.9 3.9 0 0 0 6 9c0 3.9 2.4 4.7 4.7 5-.4.4-.7 1-.7 1.7V18"/></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
