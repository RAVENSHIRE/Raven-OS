import { HERO } from "../../data/portfolio";

const highlights = [
  {
    title: "Focus",
    text: "Business-facing software, clean interfaces, and practical systems that are easy to use.",
  },
  {
    title: "Approach",
    text: "I like concise structure, clear hierarchy, and products that feel calm rather than crowded.",
  },
];

export default function Home() {
  return (
    <section className="page page-home">
      <div className="page-hero">
        <p className="page-kicker">Showroom</p>
        <h2>{HERO.name}</h2>
        <p className="page-lede">{HERO.tagline}</p>
      </div>

      <div className="page-grid page-grid-2">
        {highlights.map((item) => (
          <article key={item.title} className="info-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}