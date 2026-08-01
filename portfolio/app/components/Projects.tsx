import { projects, type Project } from '@/lib/data';
import { Icon } from './Icon';
import { SectionHeader } from './SectionHeader';

function ArchitectureMap({ project }: { project: Project }) {
  return (
    <div className={`architecture-map architecture-${project.accent}`} aria-label={`${project.name} architecture flow`}>
      {project.architecture.map((node, index) => (
        <div className="architecture-step" key={node}>
          <span className="architecture-node">{node}</span>
          {index < project.architecture.length - 1 && <span className="architecture-line" aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}

function ProjectCaseStudy({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card project-${project.accent}`}>
      <header className="project-header">
        <div>
          <p className="project-index">0{index + 1} / {project.status}</p>
          <h3>{project.name}</h3>
          <p className="project-kicker">{project.kicker}</p>
        </div>
        <div className="project-links">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} source repository`}>
              Source <Icon name="git" />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} live website`}>
              Live <Icon name="external" />
            </a>
          )}
        </div>
      </header>

      <p className="project-problem"><span>{project.summaryLabel ?? 'Problem'}</span>{project.problem}</p>
      <ArchitectureMap project={project} />

      <div className="project-detail-grid">
        <div>
          <p className="mini-label">Implementation</p>
          <ul>{project.implementation.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <p className="mini-label">Reliability &amp; security</p>
          <ul>{project.reliability.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      {project.evidence.length > 0 && (
        <div className="evidence-row">
          {project.evidence.map((item) => <span key={item}>{item}</span>)}
        </div>
      )}

      <ul className="tag-list" aria-label={`${project.name} technologies`}>
        {project.stack.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section-block section-anchor" aria-labelledby="projects-title">
      <SectionHeader id="projects-title" eyebrow="Selected work" title="Cloud and infrastructure projects." />
      <div className="projects-list">
        {projects.map((project, index) => <ProjectCaseStudy key={project.name} project={project} index={index} />)}
      </div>
    </section>
  );
}
