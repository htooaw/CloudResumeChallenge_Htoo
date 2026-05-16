import { about, education } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

export function About() {
  return (
    <section id="about" className="container-prose py-24 md:py-32">
      <SectionHeader number="01" title="About" meta="who" />

      <div className="grid gap-12 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="space-y-5 text-base leading-relaxed text-bone-1">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <aside className="md:col-span-2">
          <div className="panel p-5">
            <div className="section-label mb-4">
              <span className="text-amber-glow">●</span>
              Education
            </div>
            <div className="space-y-1">
              <p className="text-bone-0">{education.degree}</p>
              <p className="text-mono-sm text-bone-1">{education.school}</p>
              <p className="text-mono-xs text-bone-2">
                {education.period} · GPA {education.gpa}
              </p>
            </div>
            <div className="mt-5 border-t border-ink-3 pt-4">
              <p className="mb-2 text-mono-xs uppercase tracking-widest2 text-bone-3">
                Coursework
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {education.coursework.map((c) => (
                  <li key={c} className="pill">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
