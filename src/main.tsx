import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class AppErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  override render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main style={{ padding: "1rem", fontFamily: "monospace", color: "#111", background: "#fff" }}>
        <h1 style={{ marginTop: 0 }}>Runtime error</h1>
        <p>The app crashed during render. Please share this message:</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{this.state.message || "Unknown error"}</pre>
      </main>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <main style={{ padding: "1rem", fontFamily: "monospace", color: "#111", background: "#fff" }}>
      <h1 style={{ marginTop: 0 }}>Loading app...</h1>
    </main>
  </React.StrictMode>
);

async function bootstrap() {
  try {
    const module = await import("./App");
    const App = module.default;

    root.render(
      <React.StrictMode>
        <AppErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    const message = error instanceof Error ? `${error.message}\n\n${error.stack ?? ""}` : String(error);

    root.render(
      <main style={{ padding: "1rem", fontFamily: "monospace", color: "#111", background: "#fff" }}>
        <h1 style={{ marginTop: 0 }}>Module load error</h1>
        <p>The app failed before React render. Please share this message:</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>
      </main>
    );
  }
}

void bootstrap();
