# CRUSH.md
Project commands and conventions for agentic coding.

## Commands
- Build: `npm run build`
- Lint: `npm run lint` (ESLint + Prettier)
- Typecheck: `npm run typecheck`
- Test all: `npm test`
- Test single: `npx cypress run --spec cypress/e2e/*.cy.ts`

## Code Style
- **Imports**: Relative paths (`./utils`, `../components`). No absolute paths.
- **Formatting**: Prettier (2-space indent, trailing commas, 80-char lines)
- **Types**: Strict TypeScript; prefer interfaces for props, `type` for utilities
- **Naming**:
  - Components: PascalCase (`DataView.tsx`)
  - Functions: camelCase (`useDataFromSource`)
  - Test files: `.cy.ts` in `-tests/` directories
- **Error Handling**:
  - Async ops: `try/catch` with context actions
  - Validate API responses with Zod where applicable
- **Testing**:
  - Mock API calls; avoid real network requests
  - Follow existing test patterns in `cypress/e2e/`

## Notes
- No Cursor/Copilot rules detected
- Always mirror existing patterns in `/components` and `/pages`