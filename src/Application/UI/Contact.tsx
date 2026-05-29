export default function Contact() {
  return (
    <section className="page">
      <div className="page-hero page-hero-inline">
        <p className="page-kicker">Contact</p>
        <h2>Reach out for collaborations, projects, or a quick conversation.</h2>
        <p className="page-lede">The cleanest contact path is email, but the window can also hold a short message form.</p>
      </div>

      <div className="contact-grid">
        <article className="info-card contact-card">
          <h3>Email</h3>
          <a href="mailto:contact@example.com">contact@example.com</a>
        </article>

        <form className="contact-form info-card contact-card" onSubmit={(event) => event.preventDefault()}>
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" />
          </label>

          <label>
            Message
            <textarea name="message" rows={5} placeholder="Tell me about your idea" />
          </label>

          <button type="submit">Send message</button>
        </form>
      </div>
    </section>
  );
}