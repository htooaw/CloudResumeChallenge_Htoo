import { experience } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

export function Experience() {
  return (
    <section id="experience" className="container-prose py-24 md:py-32">
      <SectionHeader number="02" title="Experience" meta="work history" />

      <ol className="space-y-10">
        {experience.map((job, idx) => (
          <li key={idx} className="rail">
            <span className="rail-dot" aria-hidden />
            <article className="space-y-4">
              <header className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-lg font-medium text-bone-0">{job.role}</h3>
                  <p className="text-mono-xs uppercase tracking-widest2 text-bone-2">
                    {job.period}
                  </p>
                </div>
                <p className="text-mono-sm text-amber-glow/90">
                  {job.company}
                  <span className="text-bone-3"> · </span>
                  <span className="text-bone-2">{job.location}</span>
                </p>
              </header>

              <ul className="space-y-2 text-bone-1">
                {job.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 text-mono-sm leading-relaxed">
                    <span className="select-none text-amber-glow/60" aria-hidden>
                      ▸
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
