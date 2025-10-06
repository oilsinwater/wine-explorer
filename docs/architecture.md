# Architecture Overview

Wine Explorer is a browser-only React application that fetches CSV datasets at runtime and renders interactive analytics without a server. The core architecture emphasises predictable state management, resilient loading, and accessibility-friendly updates.

## Technology Stack

- **Runtime:** React 18 with TypeScript and Vite.
- **Routing:** TanStack Router provides file-based routes and code-splitting.
- **Styling & UI:** Material UI (MUI) components with a thin layer of project-specific wrappers.
- **Data Visualisation:** Plotly renders histograms and scatter plots.
- **Data Fetching:** `d3-fetch` parses CSV data in the browser; no remote API is required.

## Runtime Data Flow

```
┌─────────────────────┐
│ public/data/*.csv   │ Static datasets
└─────────┬───────────┘
          │ loadData()
          ▼
┌─────────────────────┐
│ wineDataManager     │ Parses, caches, and normalises rows
└─────────┬───────────┘
          │ context value
          ▼
┌─────────────────────┐
│ WineDataContext     │ Manages dataset, filters, status, errors
└─┬───────┬───────┬───┘
  │       │       │
  ▼       ▼       ▼
Dataset  Filter  Visualization & Info components
Selector Panel
```

## State Management

- `WineDataContext` wraps the application and exposes dataset state, filter criteria, loading status, and error metadata.
- Filter ranges are derived from dataset stats (`wineDataManager.getFeatureRanges`) and mirrored in the URL for shareable state.
- Accessibility announcements originate from `AccessibilityContext`, ensuring status messages reach assistive technologies.

## Error & Retry Strategy

- `wineDataManager` normalises CSV parsing and network issues into `DatasetLoadError` instances.
- `WineDataContext` retries load errors up to three times with exponential backoff before surfacing UI errors.
- Errors are converted to human-friendly messages via `toNormalizedError` and logged through `errorLogger` for future monitoring integrations.

## Performance Considerations

- CSV results are cached in-memory per dataset to avoid redundant network fetches.
- Filtering runs synchronously on the cached dataset; debounced slider interactions minimise re-renders.
- Heavy Plotly re-renders are gated behind simple toggles and feature selectors to keep the DOM lightweight.

Refer to [`api.md`](api.md) for surface-level contracts and [`components.md`](components.md) for details on how UI pieces consume the shared state.
