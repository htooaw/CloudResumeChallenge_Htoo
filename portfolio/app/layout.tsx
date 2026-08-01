import type { Metadata, Viewport } from 'next';
import { profile } from '@/lib/data';
import './globals.css';

const siteUrl = 'https://htooaungwin.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
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
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: siteUrl,
    siteName: `${profile.name} Portfolio`,
    type: 'website',
    locale: 'en_SG',
  },
  twitter: {
    card: 'summary',
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: '#151312',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
