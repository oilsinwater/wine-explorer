# Deployment Guide

Wine Explorer is a static client application. Deployment revolves around serving the generated assets and ensuring relative paths resolve correctly.

## Build Output

- `npm run build` creates a production bundle in `dist/`.
- `npm run preview` serves the bundle locally at http://localhost:4173 to confirm everything works before release.

## Environment Configuration

- `VITE_BASE_URL` (optional): set to a path prefix (e.g. `/wine-explorer/`) when hosting behind a subdirectory. The value feeds both the Vite dev server and the production `base` path.
- Static CSV datasets live under `public/data/`. Deploy the folder alongside the compiled assets so runtime fetches resolve.

## Hosting Options

1. **GitHub Pages**
   - Ensure `homepage` in `package.json` points to the Pages URL (e.g. `https://superbloom.github.io/wine-explorer/`).
   - Run `npm run deploy` to build and publish `dist/` to the `gh-pages` branch via the `gh-pages` CLI.
   - The script is configured with `-e demo` to keep existing deployment history.
2. **Static Hosting (Netlify, Vercel, S3, etc.)**
   - Build locally (`npm run build`) or configure the provider to run the same command.
   - Upload or point the host to the `dist/` directory.
   - Ensure redirects are configured for client-side routing if deploying the full Strudel flow. For this single-page demo, no special rules are required.

## Post-Deployment Checks

- Validate that dataset fetches succeed for both red and white wine datasets.
- Exercise filters and visualization toggles to confirm Plotly assets load correctly.
- Run `npm run cy:test` against the deployed environment when possible to catch regressions.
- Monitor the browser console for logged errors from `errorLogger` during smoke tests.

Document new hosting targets or environment quirks here to keep operational knowledge centralised.
