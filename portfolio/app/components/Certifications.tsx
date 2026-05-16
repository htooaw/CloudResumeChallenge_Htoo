import { certifications, achievements } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  cloud: { label: 'Cloud & Infrastructure', accent: 'text-amber-glow' },
  network: { label: 'Networking', accent: 'text-signal-green' },
  security: { label: 'Security & Monitoring', accent: 'text-signal-red' },
};

export function Certifications() {
  const grouped = certifications.reduce<Record<string, typeof certifications>>(
    (acc, cert) => {
      (acc[cert.category] ??= []).push(cert);
      return acc;
    },
    {},
  );

  return (
    <section id="certs" className="container-prose py-24 md:py-32">
      <SectionHeader
        number="05"
        title="Certifications & Awards"
        meta={`${certifications.length} certs · ${achievements.length} honors`}
      />

      <div className="space-y-10">
        {Object.entries(grouped).map(([cat, certs]) => {
          const meta = CATEGORY_META[cat];
          return (
            <div key={cat}>
              <h3 className={`mb-4 text-mono-xs uppercase tracking-widest2 ${meta.accent}`}>
                <span className="opacity-60">[</span>
                {meta.label}
                <span className="opacity-60">]</span>
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {certs.map((c) => (
                  <li
                    key={c.name}
                    className="panel flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${meta.accent.replace('text-', 'bg-')}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-mono-sm text-bone-0">{c.name}</p>
                      <p className="text-mono-xs text-bone-2">{c.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* achievements / honors */}
        <div className="border-t border-ink-3 pt-10">
          <h3 className="mb-4 text-mono-xs uppercase tracking-widest2 text-bone-2">
            <span className="opacity-60">[</span>
            Honors
            <span className="opacity-60">]</span>
          </h3>
          <ol className="space-y-4">
            {achievements.map((a) => (
              <li key={a.title} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                <span className="shrink-0 font-serif text-2xl italic text-amber-glow sm:w-20">
                  {a.year}
                </span>
                <div>
                  <p className="text-bone-0">{a.title}</p>
                  <p className="mt-1 text-mono-sm leading-relaxed text-bone-2">
                    {a.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
