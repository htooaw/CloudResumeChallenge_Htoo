import { project } from '@/lib/data';

export function Project() {
  return (
    <section aria-labelledby="project">
      <h2 id="project">Project</h2>
      <div className="project-head">
        <h3>{project.name}</h3>
        <span className="project-links">
          <a href={project.live}>Live</a>
          <a href={project.blog} target="_blank" rel="noopener noreferrer">Blog post</a>
          <a href={project.code} target="_blank" rel="noopener noreferrer">Code</a>
        </span>
      </div>
      <p>
        My résumé site, built end to end on AWS for the{' '}
        <a href={project.challengeUrl} target="_blank" rel="noopener noreferrer">Cloud Resume Challenge</a>, a 16-step
        project by Forrest Brazeal, plus most of its DevOps mods. You are reading the output of its pipeline.
      </p>
      <h4 className="minor">How it&apos;s built</h4>
      <ul>
        {project.built.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="stack">{project.stack.join(' · ')}</p>
    </section>
  );
}
