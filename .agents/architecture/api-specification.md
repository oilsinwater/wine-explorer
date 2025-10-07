# API Specification

Wine Explorer does not expose a server API. Instead, the public surface area consists of a set of client-side modules that load CSV datasets, manage state, and coordinate UI updates. This document captures those runtime contracts so new components and tests can interact with them safely.

## `wineDataManager`

Location: `src/utils/WineDataManager.ts`

### Methods

- `loadData(dataset: WineDataSet): Promise<WineDataPoint[]>`
  - Fetches `/data/winequality-${dataset}.csv`, parses each row into a `WineDataPoint`, and caches results in-memory.
  - Throws `DatasetLoadError` with codes `FILE_NOT_FOUND`, `NETWORK_ERROR`, `PARSE_ERROR`, `EMPTY_DATASET`, or `UNKNOWN`.
  - Retries are orchestrated by `WineDataContext`; consumers should treat errors as final.
- `applyFilters(data: WineDataPoint[], filters: FilterCriteria): WineDataPoint[]`
  - Returns a filtered array constrained by alcohol, pH, and volatile acidity ranges.
  - Intended for synchronous use; no mutation of the original array occurs.
- `getFeatureRanges(data: WineDataPoint[]): FilterCriteria`
  - Computes min/max values for supported filter fields. Falls back to sensible defaults when the dataset is empty.

### Types

- `FilterCriteria`
  ```ts
  interface FilterCriteria {
    alcohol: { min: number; max: number };
    pH: { min: number; max: number };
    volatileAcidity: { min: number; max: number };
  }
  ```
- `WineDataPoint`
  ```ts
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
  ```

### Usage Example

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

Location: `src/context/WineDataContext.tsx`

### Provider

Wrap application routes with `WineDataProvider` to expose shared state:

```tsx
import { WineDataProvider } from '../context/WineDataContext';

export const App = () => (
  <WineDataProvider>
    <Router />
  </WineDataProvider>
);
```

### Context Value

- `wineData: WineDataPoint[]` — raw dataset currently loaded
- `filteredData: WineDataPoint[]` — dataset after `FilterCriteria` applied
- `currentDataset: WineDataSet` — `'red'` or `'white'`
- `loadStatus: 'idle' | 'loading' | 'ready' | 'error'` — high-level load state
- `loading: boolean` — true while fetching data
- `isFiltering: boolean` — true while filters are recomputing
- `error: NormalizedAppError | null` — normalised error details for UI display
- `filters: FilterCriteria` — active filter ranges
- `featureRanges: FilterCriteria` — dataset-derived min/max limits
- `retryLoad: () => void` — re-attempt dataset loading after an error
- `lastLoadedAt: number | null` — timestamp (ms) of the last successful load

### Actions

- `switchDataset(dataset: WineDataSet)`: triggers dataset change and reload sequence.
- `updateFilters(partial: Partial<FilterCriteria>)`: merges new filter values and reapplies filtering.
- `clearFilters()`: resets to dataset-derived ranges.

### Error Model

Errors thrown by `wineDataManager` are normalised via `toNormalizedError` into:

```ts
interface NormalizedAppError {
  title: string;
  description: string;
  code: DatasetErrorCode;
  retryable: boolean;
  dataset?: WineDataSet;
}
```

UI components render alerts based on `error.description` and the `retryable` flag. Logging is delegated to `errorLogger.log()` for future telemetry integrations.

## Supporting Utilities

- `errorLogger` (`src/utils/errorLogger.ts`): currently forwards errors to `console.error`; replaceable with a monitoring integration.
- `AccessibilityContext` (`src/context/AccessibilityContext.tsx`): exposes `announce(message, politeness)` for screen-reader announcements. Components should prefer it over direct `aria-live` DOM manipulation.

Together, these modules form the stable integration surface for feature work. When introducing new data operations or context fields, update this specification to keep downstream consumers in sync.
