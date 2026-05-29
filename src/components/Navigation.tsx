import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../data/portfolio";

const navStyle = {
  width: "100%",
  maxWidth: 880,
  margin: "0 auto",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",
  paddingBottom: "14px",
  borderBottom: "1px solid #20252c",
  flexWrap: "wrap" as const,
};

const linksStyle = {
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap" as const,
};

export default function Navigation() {
  return (
    <header style={navStyle}>
      <NavLink
        to="/"
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: "#f5f7fa",
        }}
      >
        Jay Krayenbuehl
      </NavLink>

      <nav style={linksStyle} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              paddingBottom: "6px",
              borderBottom: isActive ? "1px solid #f5f7fa" : "1px solid transparent",
              color: isActive ? "#f5f7fa" : "#8f98a3",
              fontSize: "0.92rem",
              fontWeight: 400,
              letterSpacing: "0.01em",
              transition: "color 0.2s ease, border-color 0.2s ease",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
