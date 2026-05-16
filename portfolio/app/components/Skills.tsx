import { skills } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

export function Skills() {
  const entries = Object.entries(skills);

  return (
    <section id="skills" className="container-prose py-24 md:py-32">
      <SectionHeader number="04" title="Skills" meta="tech stack" />

      <div className="grid gap-px overflow-hidden rounded-md border border-ink-3 bg-ink-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([category, items]) => (
          <div
            key={category}
            className="bg-ink-2/40 p-6 transition-colors hover:bg-ink-2"
          >
            <h3 className="mb-4 flex items-center gap-2 text-mono-xs uppercase tracking-widest2 text-amber-glow">
              <span className="h-px w-3 bg-amber-glow" />
              {category}
            </h3>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-mono-sm text-bone-1"
                >
                  <span className="select-none text-bone-3">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
