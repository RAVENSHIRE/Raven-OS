import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import About from "./UI/About";
import Contact from "./UI/Contact";
import Experience from "./UI/Experience";
import Home from "./UI/Home";
import Projects from "./UI/Projects";

export default function Router() {
  const location = useLocation();

  return (
    <main key={location.pathname} className="showroom-route" aria-live="polite">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}