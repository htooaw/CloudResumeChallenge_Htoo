import type { Metadata } from 'next';
import './globals.css';
import { profile } from '@/lib/data';

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  authors: [{ name: profile.name }],
  keywords: [
    'SRE',
    'Site Reliability Engineer',
    'DevOps',
    'Cloud Engineer',
    'AWS',
    'Terraform',
    'Singapore',
    profile.name,
  ],
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: 'website',
    locale: 'en_SG',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  // TODO: replace with your deployed CloudFront/S3 domain
  metadataBase: new URL('https://example.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
