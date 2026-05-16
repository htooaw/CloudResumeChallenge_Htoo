import { profile } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

const CHANNELS = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    cmd: 'mail',
  },
  {
    label: 'LinkedIn',
    value: profile.linkedin.replace(/^https?:\/\//, ''),
    href: profile.linkedin,
    cmd: 'open',
  },
  {
    label: 'GitHub',
    value: profile.github.replace(/^https?:\/\//, ''),
    href: profile.github,
    cmd: 'gh',
  },
];

export function Contact() {
  return (
    <section id="contact" className="container-prose py-24 md:py-32">
      <SectionHeader number="06" title="Contact" meta="open channel" />

      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <h3 className="font-serif text-3xl italic leading-tight text-bone-0 sm:text-4xl">
            Got a reliability problem worth solving<span className="text-amber-glow">?</span>
          </h3>
          <p className="mt-5 max-w-md leading-relaxed text-bone-1">
            Always interested in talking to teams building serious infrastructure.
            Internships, junior cloud / SRE roles, or just trading notes — the inbox
            is open.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-amber-dim/40 bg-amber-ghost px-5 py-3 text-mono-sm text-amber-glow transition-all hover:border-amber-glow hover:bg-amber-glow/15"
          >
            <span aria-hidden>$</span>
            send mail
            <span className="ml-1 inline-block h-3.5 w-1.5 animate-blink bg-amber-glow" />
          </a>
        </div>

        <div className="md:col-span-2">
          <div className="panel overflow-hidden font-mono">
            {/* fake terminal chrome */}
            <div className="flex items-center gap-2 border-b border-ink-3 bg-ink-2 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-signal-red/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-glow/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-signal-green/70" />
              <span className="ml-auto text-mono-xs text-bone-3">
                ~/contact
              </span>
            </div>

            <ul className="divide-y divide-ink-3">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener"
                    className="flex flex-col gap-1 px-4 py-3.5 transition-colors hover:bg-ink-2"
                  >
                    <span className="text-mono-xs text-bone-3">
                      <span className="text-amber-glow">$</span> {c.cmd}{' '}
                      <span className="text-bone-2">{c.label.toLowerCase()}</span>
                    </span>
                    <span className="break-all text-mono-sm text-bone-0">
                      {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
