# Client API Reference

Wine Explorer exposes a small set of client-side modules that other components rely on. This document summarises the public contracts for those modules so feature work can integrate with confidence.

## `wineDataManager`

- **Location:** `src/utils/WineDataManager.ts`
- **Responsibilities:** Fetch CSV files, normalise rows, cache datasets, and provide helper utilities for filtering and range calculation.
- **Methods:**
  - `loadData(dataset: WineDataSet): Promise<WineDataPoint[]>`
    - Fetches `/data/winequality-${dataset}.csv`, parses each row, and caches results by dataset.
    - Throws `DatasetLoadError` with codes `FILE_NOT_FOUND`, `NETWORK_ERROR`, `PARSE_ERROR`, `EMPTY_DATASET`, or `UNKNOWN`.
  - `applyFilters(data: WineDataPoint[], filters: FilterCriteria): WineDataPoint[]`
    - Returns a filtered copy of `data` based on alcohol, pH, and volatile acidity ranges.
  - `getFeatureRanges(data: WineDataPoint[]): FilterCriteria`
    - Derives min/max values for supported filter dimensions, falling back to sensible defaults for empty datasets.
- **Types:**

  ```ts
  type WineDataSet = 'red' | 'white';

  interface WineDataPoint {
    'fixed acidity': number;
    'volatile acidity': number;
    'citric acid': number;
    'residual sugar': number;
    chlorides: number;
    'free sulfur dioxide': number;
    'total sulfur dioxide': number;
    density: number;
    pH: number;
    sulphates: number;
    alcohol: number;
    quality: number;
  }

  interface FilterCriteria {
    alcohol: { min: number; max: number };
    pH: { min: number; max: number };
    volatileAcidity: { min: number; max: number };
  }
  ```

- **Usage:**

  ```ts
  import { wineDataManager } from '../utils/WineDataManager';

  const data = await wineDataManager.loadData('red');
  const ranges = wineDataManager.getFeatureRanges(data);
  const filtered = wineDataManager.applyFilters(data, {
    ...ranges,
    alcohol: { min: 10, max: 12 },
  });
  ```

## `WineDataContext`

- **Location:** `src/context/WineDataContext.tsx`
- **Provider:** Wrap application routes with `WineDataProvider` to expose shared state.

  ```tsx
  import { WineDataProvider } from '../context/WineDataContext';

  export const App = () => (
    <WineDataProvider>
      <Router />
    </WineDataProvider>
  );
  ```

- **Context value:**
  ```ts
  interface WineDataContextValue {
    wineData: WineDataPoint[];
    filteredData: WineDataPoint[];
    currentDataset: WineDataSet;
    loadStatus: 'idle' | 'loading' | 'ready' | 'error';
    loading: boolean;
    isFiltering: boolean;
    error: NormalizedAppError | null;
    filters: FilterCriteria;
    featureRanges: FilterCriteria;
    switchDataset(dataset: WineDataSet): void;
    updateFilters(partial: Partial<FilterCriteria>): void;
    clearFilters(): void;
    retryLoad(): void;
    lastLoadedAt: number | null;
  }
  ```
- **Actions:**
  - `switchDataset(dataset)` — triggers dataset reload with retry/backoff logic.
  - `updateFilters(partial)` — merges filter updates and recomputes filtered data.
  - `clearFilters()` — resets to dataset-derived ranges.
  - `retryLoad()` — retries the most recent dataset fetch when errors are retryable.

## Supporting Utilities

- **`AccessibilityContext`** (`src/context/AccessibilityContext.tsx`)
  - Exposes `announce(message: string, politeness?: 'assertive' | 'polite')` to centralise screen-reader notifications.
  - Backed by a visually-hidden live region that components can reuse instead of managing their own DOM nodes.
- **`useDelayedVisibility`** (`src/hooks/useDelayedVisibility.ts`)
  - Provides debounce-like behaviour for loading indicators so spinners do not flash on fast operations.
- **`errorLogger`** (`src/utils/errorLogger.ts`)
  - Currently proxies to `console.error` but exists behind an interface to simplify future telemetry integrations.

Keep this document in sync with runtime changes. Any update to the context value, shared hook, or data manager signatures should be reflected here to prevent downstream drift.
