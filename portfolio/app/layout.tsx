import type { Metadata, Viewport } from 'next';
import { profile } from '@/lib/data';
import './globals.css';

const siteUrl = 'https://htooaungwin.com';
const title = `${profile.name} · ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.intro,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: '/' },
  keywords: [
    'Cloud Engineer',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Platform Engineer',
    'AWS',
    'Terraform',
    'Kubernetes',
    'Singapore',
    profile.name,
  ],
  openGraph: {
    title,
    description: profile.intro,
    url: siteUrl,
    siteName: `${profile.name} Portfolio`,
    type: 'website',
    locale: 'en_SG',
  },
  twitter: {
    card: 'summary',
    title,
    description: profile.intro,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  colorScheme: 'light dark',
};

// Applies a saved light/dark choice before first paint, so there is no flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
