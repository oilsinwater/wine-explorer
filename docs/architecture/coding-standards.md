# Coding Standards

## Critical Fullstack Rules

- **Strudel Kit Usage:** Always use Strudel kit components for UI elements as per PRD requirements
- **Client-Side Processing:** All data processing must happen in the browser, no server calls
- **CSV Data Loading:** Load data directly from static CSV files in the public directory
- **State Management:** Use the defined state management pattern consistently
- **Accessibility:** Follow WCAG AA guidelines as specified in PRD

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `DatasetSelector.tsx` |
| Hooks | camelCase with 'use' | - | `useWineData.ts` |
| API Routes | - | kebab-case | N/A |
| Database Tables | - | snake_case | N/A |
