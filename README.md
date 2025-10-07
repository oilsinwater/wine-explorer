# Wine Explorer

Wine Explorer is a Strudel Kit demo that showcases a client-side data exploration workflow for the UCI Wine Quality datasets. The application is built with React, TypeScript, and Vite and demonstrates how to deliver rapid dataset inspection, lightweight analytics, and accessibility-first interactions without relying on a backend service.

## Features

- Switch between red and white wine datasets with cached loading and retryable error handling.
- Filter by alcohol, pH, and volatile acidity using keyboard-accessible range sliders that keep URL state in sync.
- Explore interactive histograms and scatter plots powered by Plotly to compare feature distributions and relationships.
- Review dataset metadata, citation details, and filtered record counts in an info panel optimized for assistive technology.
- Ship as a static, client-only bundle that runs entirely in the browser and can be deployed to any static host.

## Prerequisites

- Node.js ^18.18.0 or >=20.0.0 (matches the `engines` field)
- npm 9+

## Installation

```bash
git clone https://github.com/superbloom/wine-explorer.git
cd wine-explorer
npm install
```

## Local Development

```bash
npm run dev
```

The Vite dev server runs on http://localhost:5175 with strict port enforcement. Environment variables are optional; define `VITE_BASE_URL` in a `.env` file if the app is hosted behind a path prefix.

## Quality Checks & Testing

- `npm test` — runs the Vitest suite with the `jsdom` environment and shared setup in `tests/setup.ts`.
- `npm run cy:open` — opens the Cypress runner for exploratory end-to-end testing.
- `npm run cy:test` — runs the Cypress suite headlessly for CI.
- `npm run lint` / `npm run lint:fix` — lints the project with the Airbnb TypeScript configuration.
- `npm run prettier` / `npm run prettier:fix` — checks or formats code according to the project Prettier rules.
- `npm run style:all` — type-checks, lints, and runs Prettier to mimic the repository gate before committing.

Vitest supports watch mode via `npm test -- --watch` when iterating on new units.

## Production Build

```bash
npm run build
```

The build step runs TypeScript type-checking and emits an optimized static bundle into `dist/`. Preview the production build locally before deploying:

```bash
npm run preview
```

## Deployment

- Ensure `homepage` in `package.json` or `VITE_BASE_URL` matches the target path when deploying behind a subdirectory.
- `npm run build` to generate the latest bundle.
- Publish the `dist/` directory to your static host.

For GitHub Pages the project ships with a helper script:

```bash
npm run deploy
```

This command pushes the built `dist/` folder to the `gh-pages` branch using the `gh-pages` CLI with history preservation (`-e demo`).

## Project Structure

```
.
├── public/                 # Static assets, including winequality CSV datasets
├── src/
│   ├── components/         # Dataset selector, filter panel, visualization suite, info panel, layout primitives
│   ├── context/            # React contexts for wine data and accessibility announcements
│   ├── hooks/              # Reusable hooks (e.g., delayed spinners)
│   ├── pages/              # Routed page shells used by TanStack Router
│   ├── types/              # Shared TypeScript interfaces for wine data and filters
│   └── utils/              # Data manager, error helpers, and filtering utilities
├── tests/                  # Vitest setup and helpers
├── cypress/                # Cypress end-to-end specs and fixtures
├── docs/                   # Extended architecture, component, and workflow documentation
└── vite.config.ts          # Vite and Vitest configuration
```

## Documentation

Developer documentation lives in `docs/`. Start with `docs/README.md` for an index that links to architecture, component, workflow, and API references.

## Contributing

Contributions are welcome! Begin with `CONTRIBUTING.md` for branching workflow, code standards, and review expectations, and review `CODE_OF_CONDUCT.md` for community guidelines. Open an issue before large changes so maintainers can help scope the work.

## License

Wine Explorer inherits the STRUDEL project license. Review the full terms in `LICENSE`, published by Lawrence Berkeley National Laboratory on behalf of the STRUDEL project.

## Acknowledgments

- UCI Machine Learning Repository for the red and white wine quality datasets (DOI: 10.24432/C56S3T).
- The STRUDEL project and Superbloom for the design system, task flow templates, and engineering starter kit used to deliver this demo.
