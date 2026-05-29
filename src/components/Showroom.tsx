import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Experience from "../pages/Experience";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import { HERO, NAV_ITEMS } from "../data/portfolio";

export default function Showroom() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) {
    return (
      <div className="showroom-panel showroom-home-landing" role="region" aria-label="Home landing">
        <h1>{HERO.name}</h1>
        <p className="showroom-home-subtitle">{HERO.tagline}</p>

        <nav className="showroom-home-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `showroom-home-link ${isActive ? "is-active" : ""}`}
            >
              {item.label.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        <main key={location.pathname} className="showroom-content" aria-live="polite">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="showroom-panel showroom-split-layout" role="region" aria-label="Showroom content">
      <aside className="showroom-sidebar" aria-label="Sidebar navigation">
        <header className="showroom-sidebar-head">
          <h2>{HERO.name}</h2>
          <p>Showcase '26</p>
        </header>

        <nav className="showroom-sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `showroom-sidebar-link ${isActive ? "is-active" : ""}`}
            >
              {({ isActive }) => (
                <>
                  <span className="showroom-sidebar-bullet" aria-hidden="true">
                    {isActive ? "o" : ""}
                  </span>
                  <span>{item.label.toUpperCase()}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="showroom-main-area">
        <div className="showroom-resume-box" role="note" aria-label="Resume hint">
          <span className="showroom-resume-icon" aria-hidden="true">
            💾
          </span>
          <strong>Looking for my resume?</strong>
          <a href="#" onClick={(event) => event.preventDefault()}>
            Click here to download it!
          </a>
        </div>

        <main key={location.pathname} className="showroom-main-content" aria-live="polite">
        <Routes location={location}>
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/about" replace />} />
        </Routes>
        </main>
      </section>
    </div>
  );
}
