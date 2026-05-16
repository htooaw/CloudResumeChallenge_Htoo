import { profile } from '@/lib/data';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-3">
      <div className="container-prose flex flex-col gap-3 py-8 text-mono-xs text-bone-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}. Built with Next.js · Hosted on AWS S3 + CloudFront.
        </p>
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
          all systems operational
        </p>
      </div>
    </footer>
  );
}
