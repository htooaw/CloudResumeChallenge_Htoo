import { education, experience } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

export function Experience() {
  return (
    <section id="experience" className="section-block section-anchor" aria-labelledby="experience-title">
      <SectionHeader id="experience-title" eyebrow="Experience & education" title="System, network, and security experience." />

      <div className="timeline">
        {experience.map((job) => (
          <article className="timeline-row" key={`${job.company}-${job.role}`}>
            <div className="timeline-period">{job.period}</div>
            <div className="timeline-content">
              <p className="timeline-meta">{job.company} · {job.location}</p>
              <h3>{job.role}</h3>
              <p className="timeline-summary">{job.summary}</p>
              <ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </div>
          </article>
        ))}

        <article className="timeline-row timeline-education">
          <div className="timeline-period">{education.period}</div>
          <div className="timeline-content">
            <p className="timeline-meta">{education.school} · GPA {education.gpa}</p>
            <h3>{education.degree}</h3>
            <ul className="coursework-list" aria-label="Relevant coursework">
              {education.coursework.map((course) => <li key={course}>{course}</li>)}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
