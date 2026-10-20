import { projects, type ProjectEntry } from '@/lib/data';

function Intro({ project }: { project: ProjectEntry }) {
  const { intro, introLink } = project;
  const at = introLink ? intro.indexOf(introLink.text) : -1;
  if (!introLink || at === -1) return <p>{intro}</p>;
  return (
    <p>
      {intro.slice(0, at)}
      <a href={introLink.href} target="_blank" rel="noopener noreferrer">{introLink.text}</a>
      {intro.slice(at + introLink.text.length)}
    </p>
  );
}

export function Projects() {
  return (
    <section aria-labelledby="projects">
      <h2 id="projects">Projects</h2>
      {projects.map((project) => (
        <article className="project" key={project.name}>
          <div className="project-head">
            <h3>
              {project.name}
              {project.tag && <span className="tag">{project.tag}</span>}
            </h3>
            <span className="project-links">
              {project.links.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
              ))}
            </span>
          </div>
          <Intro project={project} />
          <h4 className="minor">{project.listHeading}</h4>
          <ul>
            {project.items.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="stack">{project.stack.join(' · ')}</p>
        </article>
      ))}
    </section>
  );
}
