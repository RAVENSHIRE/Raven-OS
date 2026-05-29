import { EXPERIENCE } from "../data/portfolio";

export default function Experience() {
  return (
    <section className="page">
      <div className="page-hero page-hero-inline">
        <p className="page-kicker">Experience</p>
        <h2>Hands-on operational work with a strong service mindset.</h2>
        <p className="page-lede">A snapshot of roles that shaped how I think about process, communication, and reliability.</p>
      </div>

      <div className="timeline">
        {EXPERIENCE.map((item) => (
          <article key={`${item.company}-${item.period}`} className="timeline-item info-card">
            <div className="timeline-head">
              <div>
                <h3>{item.title}</h3>
                <p className="timeline-company">{item.company}</p>
              </div>
              <p className="timeline-period">{item.period}</p>
            </div>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
