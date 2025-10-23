# Development Workflow

This workflow keeps the Wine Explorer codebase consistent across contributors. It reflects the scripts in `package.json` and the expectations captured in the architecture and QA plans.

## Prerequisites

```bash
# Verified toolchain versions
node --version  # >= 18.18.0 or >= 20.0.0
npm --version   # >= 9
```

Install dependencies the first time you clone the repository:

```bash
npm install
```

> Husky installs the pre-commit hook during `npm install`. If you skip that step, run `npx husky install` manually before committing.

## Daily Development Cycle

1. **Start the dev server**

   ```bash
   npm run dev
   ```

   - Serves the app on http://localhost:5173 by default (configurable via VITE_PORT environment variable).
   - Static CSV datasets are available under `/data/winequality-*.csv`.

2. **Edit with fast feedback**

   - Hot Module Replacement (HMR) applies component changes instantly.
   - Dataset switches announce status updates via the accessibility context—verify copy whenever UX output changes.

3. **Validate continuously**

   - Static analysis: `npm run lint`
   - Formatting: `npm run prettier`
   - Unit/integration tests: `npm test -- --watch`
   - End-to-end tests (smoke): `npm run cy:test`

4. **Commit responsibly**

   - Run the full quality gate before pushing: `npm run style:all`
   - Ensure Vitest and Cypress suites are green when changing data logic or visualisations.
   - Husky will block the commit if linting fails on staged files.

5. **Sync regularly**
   - Rebase or merge `main` frequently to avoid stale dataset typings and context changes.
   - Resolve conflicts in `WineDataContext.tsx` carefully—it orchestrates most interactions.

## Branching and Reviews

1. Create a feature branch from `main` (`git checkout -b feat/<short-description>`).
2. Implement changes alongside updated documentation when behaviour shifts.
3. Push the branch and open a pull request that links to the relevant story (e.g., Story 3.3).
4. Fill in the PR checklist: tests run, docs updated, accessibility verified.
5. Request review from at least one maintainer; address feedback with follow-up commits (avoid force pushes unless requested).

## Environment Configuration

- **Base URL:** Set `VITE_BASE_URL` in `.env.local` if the application is served from a sub-path. Example:
  ```bash
  VITE_BASE_URL=/wine-explorer/
  ```
- **Analytics and external services:** None configured—additions must include documentation updates and opt-in toggles.
- **Testing env:** Cypress uses the port specified by the CYPRESS_BASE_URL environment variable or defaults to http://localhost:3000.

## Release and Deployment Checklist

1. Bump the package version if you are cutting a tagged release (`npm version <patch|minor|major>`).
2. Generate a fresh production build:
   ```bash
   npm run build
   ```
3. Smoke test the bundle locally:
   ```bash
   npm run preview
   ```
4. Deploy to the chosen host. For GitHub Pages:
   ```bash
   npm run deploy
   ```
5. Verify the published site loads both datasets and that accessibility announcements still trigger in a screen reader.

Adhering to this workflow ensures the Wine Explorer demo stays reliable, accessible, and easy to extend.
