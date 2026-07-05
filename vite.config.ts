import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// host:true is required so GitHub Codespaces can forward the port to your iPad.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173, strictPort: true },
});
