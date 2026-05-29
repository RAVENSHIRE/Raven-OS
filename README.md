# Raven Portfolio

Modern portfolio website for Jay Krayenbuehl built with React, TypeScript, Vite, React Router, and Zustand.

## Features
- Clean dark theme and responsive layout
- Page-based routing: Home, About, Experience, Projects, Contact
- Lightweight page transitions without a room scene
- Tabbed project categories (Software, Music, Art)
- Contact form with placeholder contact details only

## Current Direction
- Start on the screen/desktop experience first
- No 3D room bootstrap or room-first entry flow

## Development
```bash
npm install
npm run dev
```

## iPad Pro + Devcontainer (Codespaces)
1. Open this repository in GitHub Codespaces.
2. Wait for post-create to finish (`bootstrap.sh` runs `npm install`).
3. The dev server starts automatically on attach if it is not already running.
4. Open forwarded port `5173` in the browser.

Notes:
- Safari on iPad works best in desktop mode for Codespaces.
- If the server is not running, execute `npm run dev` manually.
- For a clean restart, rebuild the container from the Codespaces command palette.

## Build
```bash
npm run build
npm run preview
```

## Vercel Environments Workflow

### Local environment
1. Install Vercel CLI once:

```bash
npm i -g vercel
```

2. Link project:

```bash
npm run vercel:link
```

3. Pull environment variables:

```bash
npm run vercel:pull
```

This creates or updates `.env.local`.

### Preview environment
Use preview deploys for branch testing and QA:

```bash
npm run vercel:preview
```

Every preview deployment receives its own URL.

### Production environment
Deploy current state to production:

```bash
npm run vercel:prod
```

### Custom environment example (staging)
If your Vercel plan supports custom environments:

```bash
npm run vercel:staging
```

### Recommended branch flow
1. Feature branches: preview deployments
2. Main branch: production deployment
3. Optional staging branch: custom environment deployment

## Project Structure
- src/pages: route pages
- src/components: reusable UI cards and navigation
- src/data/portfolio.ts: portfolio content model
- src/store/uiStore.ts: lightweight UI state with Zustand
