import { useState } from "react";
import { ExperienceItem } from "../data/portfolio";

export default function ExperienceCard({ item }: { item: ExperienceItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flexDirection: "column",
        gap: "14px",
        padding: "22px 0",
        borderTop: `1px solid ${isHovered ? "#4a525b" : "#20252c"}`,
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.18s ease, border-color 0.18s ease",
      }}
    >
      <div style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
        <div style={{ flexDirection: "column", gap: "4px" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#f5f7fa" }}>{item.title}</h3>
          <p style={{ margin: 0, color: "#aab3bd", fontSize: "0.94rem" }}>{item.company}</p>
        </div>
        <p style={{ margin: 0, color: "#777f89", fontSize: "0.9rem" }}>{item.period}</p>
      </div>
      <p style={{ margin: 0, maxWidth: "680px", color: "#b9c0c8", lineHeight: 1.75 }}>{item.description}</p>
    </article>
  );
}
