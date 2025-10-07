# Development Workflow

This document outlines the recommended workflow for contributing to Wine Explorer. It complements the high-level overview in the repository README and the detailed contribution guidance in `CONTRIBUTING.md`.

## Environment Setup

1. Install Node.js ^18.18.0 or >=20.0.0 and npm 9+.
2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/superbloom/wine-explorer.git
   cd wine-explorer
   npm install
   ```
3. Husky installs a pre-commit hook during `npm install`. If hooks are missing, run `npx husky install`.

## Everyday Commands

| Task                   | Command             | Notes                                                          |
| ---------------------- | ------------------- | -------------------------------------------------------------- |
| Start dev server       | `npm run dev`       | Runs on http://localhost:5175 with HMR enabled.                |
| Unit/integration tests | `npm test`          | Add `-- --watch` to stay in watch mode while iterating.        |
| Cypress (headed)       | `npm run cy:open`   | Launches the Cypress GUI for exploratory flows.                |
| Cypress (CI)           | `npm run cy:test`   | Executes the suite in headless mode.                           |
| Linting                | `npm run lint`      | Uses ESLint with Airbnb TypeScript configuration.              |
| Formatting             | `npm run prettier`  | Uses the shared Prettier config defined in `.prettierrc.json`. |
| Full quality gate      | `npm run style:all` | Type-checks, lints, and formats in one pass.                   |

## Branching & Reviews

- Create feature branches from `main` following the format `feature/<name>` or `fix/<name>`; stories may adopt `story/<id>-<slug>`.
- Open a draft pull request early to surface context and receive feedback.
- Run `npm run style:all` before pushing to avoid CI failures.
- Every pull request should include a summary of changes, testing evidence, and any follow-up tasks.

## Data & Environment Notes

- Sample CSV datasets live in `public/data/` and load via relative paths. Update both datasets when introducing schema changes.
- Environment variables are optional. Set `VITE_BASE_URL` in `.env` if deploying behind a subdirectory.

## Release Checklist

1. `npm run style:all`
2. `npm test`
3. `npm run cy:test`
4. `npm run build`
5. `npm run deploy` (if promoting to GitHub Pages)

Document new workflows or deviations from this checklist to keep the team aligned.
