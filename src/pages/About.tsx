import { ABOUT } from "../data/portfolio";
import { NavLink } from "react-router-dom";

const points = [
  {
    title: "About Me",
    text: ABOUT.aboutMe,
  },
  {
    title: "Skills",
    text: ABOUT.hobbies,
  },
];

export default function About() {
  return (
    <section className="page">
      <div className="page-hero page-hero-inline">
        <p className="page-kicker">About</p>
        <h2>Structured, practical, and focused on useful digital products.</h2>
        <p className="page-lede">{ABOUT.intro}</p>
      </div>

      <div className="page-stack">
        {points.map((point) => (
          <article key={point.title} className="info-card info-card-wide">
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </article>
        ))}

        <NavLink to="/contact" className="about-contact-cta">
          {ABOUT.contactCta}
        </NavLink>
      </div>
    </section>
  );
}
