import { profile } from '@/lib/data';

export function Hero() {
  return (
    <section
      id="top"
      className="container-prose relative flex min-h-[92vh] flex-col justify-center pt-32 pb-24"
    >
      {/* metadata header — runbook-style */}
      <div className="reveal mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-mono-xs uppercase tracking-widest2 text-bone-2">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green" />
          </span>
          {profile.status}
        </span>
        <span className="text-bone-3">·</span>
        <span>{profile.location}</span>
        <span className="text-bone-3">·</span>
        <span className="text-amber-glow/80">SGT</span>
      </div>

      {/* name — large display serif italic for editorial contrast */}
      <h1
        className="reveal font-serif text-5xl italic leading-[0.95] tracking-tight text-bone-0 sm:text-7xl md:text-8xl"
        style={{ animationDelay: '60ms' }}
      >
        {profile.name}
        <span className="text-amber-glow">.</span>
      </h1>

      {/* role — monospace, all caps, generous tracking */}
      <p
        className="reveal mt-6 max-w-2xl font-mono text-base uppercase tracking-widest2 text-bone-1 sm:text-lg"
        style={{ animationDelay: '160ms' }}
      >
        {profile.role}
        <span className="ml-2 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-amber-glow align-middle" />
      </p>

      {/* tagline */}
      <p
        className="reveal mt-8 max-w-xl text-base leading-relaxed text-bone-1"
        style={{ animationDelay: '260ms' }}
      >
        {profile.tagline}
      </p>

      {/* CTAs */}
      <div
        className="reveal mt-12 flex flex-wrap items-center gap-3"
        style={{ animationDelay: '380ms' }}
      >
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 rounded-sm border border-amber-dim/40 bg-amber-ghost px-4 py-2.5 text-mono-sm text-amber-glow transition-all hover:border-amber-glow hover:bg-amber-glow/15"
        >
          View work
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 rounded-sm border border-ink-3 px-4 py-2.5 text-mono-sm text-bone-0 transition-all hover:border-bone-2"
        >
          Get in touch
        </a>
      </div>

      {/* footer-row of the hero — coordinate-like metadata */}
      <div
        className="reveal mt-20 grid grid-cols-2 gap-6 border-t border-ink-3 pt-8 text-mono-xs sm:grid-cols-4"
        style={{ animationDelay: '500ms' }}
      >
        <Stat label="Focus" value="SRE / Cloud" />
        <Stat label="Stack" value="AWS · Terraform" />
        <Stat label="Certs" value="14 active" />
        <Stat label="Based" value="Singapore" />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="uppercase tracking-widest2 text-bone-3">{label}</span>
      <span className="text-bone-0">{value}</span>
    </div>
  );
}
