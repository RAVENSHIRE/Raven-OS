import Navigation from "./UI/Navigation";
import Router from "./Router";

export default function App() {
  return (
    <div className="desktop-shell">
      <section className="window showroom-window" aria-label="Showroom window">
        <div className="title-bar showroom-title-bar">
          <div className="title-bar-text">Showroom</div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Minimize" />
            <button type="button" aria-label="Maximize" />
            <button type="button" aria-label="Close" />
          </div>
        </div>

        <div className="window-body showroom-window-body">
          <Navigation />
          <Router />
        </div>
      </section>
    </div>
  );
}