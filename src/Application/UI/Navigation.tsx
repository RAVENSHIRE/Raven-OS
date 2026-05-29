import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

export default function Navigation() {
  return (
    <header className="showroom-header">
      <div className="showroom-brand">
        <h1>Jay Krayenbühl</h1>
        <p>Business Informatics Student &amp; Tech Enthusiast</p>
      </div>

      <nav className="showroom-nav" aria-label="Portfolio pages">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `showroom-link${isActive ? " is-active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}