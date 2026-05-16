import { projects } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

const STATUS_STYLES = {
  live: { dot: 'bg-signal-green', label: 'live', ring: 'shadow-[0_0_8px_rgba(126,201,110,0.6)]' },
  archived: { dot: 'bg-bone-3', label: 'archived', ring: '' },
  wip: { dot: 'bg-amber-glow', label: 'in progress', ring: 'shadow-[0_0_8px_rgba(245,184,64,0.6)]' },
};

export function Projects() {
  return (
    <section id="projects" className="container-prose py-24 md:py-32">
      <SectionHeader
        number="03"
        title="Projects"
        meta={`${projects.length} ${projects.length === 1 ? 'service' : 'services'} deployed`}
      />

      <div className="grid gap-6">
        {projects.map((p) => {
          const status = STATUS_STYLES[p.status];
          return (
            <article
              key={p.name}
              className="panel panel-amber-edge group p-6 sm:p-8"
            >
              {/* header: status + name */}
              <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-mono-xs uppercase tracking-widest2 text-bone-2">
                    <span className={`h-2 w-2 rounded-full ${status.dot} ${status.ring}`} />
                    {status.label}
                  </div>
                  <h3 className="font-serif text-2xl italic text-bone-0 sm:text-3xl">
                    {p.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener"
                      className="pill hover:border-amber-dim/60 hover:text-amber-glow"
                    >
                      <span aria-hidden>⌘</span> repo
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener"
                      className="pill-amber hover:bg-amber-glow/15"
                    >
                      <span aria-hidden>↗</span> demo
                    </a>
                  )}
                </div>
              </header>

              <p className="mb-6 max-w-3xl leading-relaxed text-bone-1">{p.summary}</p>

              {/* highlights — log-entry style */}
              <div className="mb-6 rounded-sm border border-ink-3 bg-ink-1/60 p-4">
                <div className="mb-3 text-mono-xs uppercase tracking-widest2 text-bone-3">
                  // implementation notes
                </div>
                <ul className="space-y-1.5">
                  {p.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-mono-sm leading-relaxed text-bone-1"
                    >
                      <span className="select-none text-amber-glow/50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* stack chips */}
              <ul className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="pill">
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-center text-mono-sm text-bone-2">
        More builds coming soon
        <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-amber-glow align-middle" />
      </p>
    </section>
  );
}
