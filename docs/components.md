# Component Reference

This guide documents the primary UI components that participate in the exploration workflow. Each section covers responsibilities, important props/callbacks, and accessibility considerations.

## DatasetSelector

- **Location:** `src/components/DatasetSelector.tsx`
- **Responsibilities:** Toggle between red and white datasets, announce state changes, and expose retry affordances when fetches fail.
- **Props:** `className?`
- **Context dependencies:** `WineDataContext` (`currentDataset`, `switchDataset`, `loadStatus`, `error`, `retryLoad`, `lastLoadedAt`, `wineData`).
- **Accessibility:** Uses `useAccessibility().announce` to broadcast loading, success, and error events; focus is moved to the error alert when retries are required.
- **Usage:**

  ```tsx
  import { DatasetSelector } from '../components/DatasetSelector';

  <DatasetSelector className="sidebar-section" />;
  ```

## FilterPanel

- **Location:** `src/components/FilterPanel.tsx`
- **Responsibilities:** Present range sliders for alcohol, pH, and volatile acidity; debounce updates; keep URL query parameters aligned with filter state.
- **Props:** `className?`
- **Context dependencies:** `WineDataContext` (`filters`, `featureRanges`, `updateFilters`, `clearFilters`, `filteredData`, `wineData`, `loadStatus`, `error`).
- **Accessibility:** Announces filter counts and filtered totals; disables controls during data loads; focuses retry action when loading fails.
- **Notable internals:** Debounced `updateFilters` wrapper via MUI's `debounce` helper to reduce synchronous filter churn.

## VisualizationArea

- **Location:** `src/components/visualizations/VisualizationArea.tsx`
- **Responsibilities:** Render histogram or scatter plot views using Plotly, expose feature selectors, and surface dataset status messages.
- **State:** Internal `selectedVisualization`, `selectedXFeature`, and `selectedYFeature` state, with automatic correction when the dataset changes.
- **Context dependencies:** `WineDataContext` (`filteredData`, `loading`, `error`, `retryLoad`, `loadStatus`, `currentDataset`).
- **Accessibility:** Announces visualization updates and empty states through `AccessibilityContext`.
- **Usage:** Typically placed within the main content region alongside `InfoPanel`.

## InfoPanel

- **Location:** `src/components/InfoPanel.tsx`
- **Responsibilities:** Display dataset metadata (source, DOI, feature list) and the current filtered/total counts.
- **Props:** `className?`
- **Context dependencies:** `WineDataContext` (`currentDataset`, `wineData`, `filteredData`, `loadStatus`, `error`, `retryLoad`, `lastLoadedAt`).
- **Accessibility:** Provides human-readable dataset status text and exposes retry actions when required.

## Layout Components

- **Layout primitives:** `Layout.tsx`, `TopBar.tsx`, `Footer.tsx`, and `PageHeader.tsx` compose the page chrome around the main exploration workflow.
- **Data grid helpers:** `SciDataGrid.tsx`, `LabelValueTable.tsx`, and related components render tabular details and structured metadata where needed.

These components rely on the contracts documented in [`api.md`](api.md); update both references when introducing new shared props or context fields.
