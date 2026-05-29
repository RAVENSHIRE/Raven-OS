import { PINNED_PROJECTS } from "../data/portfolio";

export default function Projects() {
  return (
    <section className="page">
      <div className="page-hero page-hero-inline">
        <p className="page-kicker">Projects</p>
        <h2>My pinned GitHub projects, shown as a clean desktop gallery.</h2>
        <p className="page-lede">These are the repositories pinned on my RAVENSHIRE profile, surfaced here as the main project set.</p>
      </div>

      <div className="page-grid project-grid">
        {PINNED_PROJECTS.map((project) => (
          <article key={project.name} className="info-card info-card-wide project-card">
            <div className="project-card-top">
              <div>
                <h3>{project.name}</h3>
                <p className="project-note">{project.note}</p>
              </div>
            </div>
            <p>{project.description}</p>
            <a href={project.link} target="_blank" rel="noreferrer">
              Open repository
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
