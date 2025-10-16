import { loadDatasetCsv, CsvLoadResult } from './csvLoader';
import { parseWineDataset, ParsedWineDataset } from './parseWineDataset';
import { DatasetLoadError, DatasetErrorCode } from '../utils/errors';
import { WineDataSet } from '../types/wine';
import { DatasetInfo, WineDataPoint, WineDataset } from '../types/wine.types';

export interface FilterCriteria {
  alcohol: { min: number; max: number };
  pH: { min: number; max: number };
  volatileAcidity: { min: number; max: number };
}

export interface DatasetLoadMetrics extends CsvLoadResult {
  parsedAt: number;
  anomalyCount: number;
}

export type DatasetManagerEvent = {
  type: 'dataset-loaded';
  dataset: WineDataSet;
  info: DatasetInfo;
  metrics: DatasetLoadMetrics;
};

type EventListener<T extends DatasetManagerEvent> = (event: T) => void;

const DEFAULT_FILTERS: FilterCriteria = {
  alcohol: { min: 8.0, max: 14.0 },
  pH: { min: 2.7, max: 4.0 },
  volatileAcidity: { min: 0.1, max: 1.2 },
};

export class WineDataManager {
  private datasetCache = new Map<
    WineDataSet,
    WeakRef<WineDataset> | WineDataset
  >();

  private fallbackCache = new Map<WineDataSet, WineDataset>();

  private metadataCache = new Map<WineDataSet, DatasetInfo>();

  private metricsCache = new Map<WineDataSet, DatasetLoadMetrics>();

  private anomalyCache = new Map<WineDataSet, ParsedWineDataset['anomalies']>();

  private listeners: {
    'dataset-loaded': Set<
      EventListener<Extract<DatasetManagerEvent, { type: 'dataset-loaded' }>>
    >;
  } = {
    'dataset-loaded': new Set(),
  };

  async loadData(
    dataset: WineDataSet,
    options?: { forceReload?: boolean; signal?: AbortSignal }
  ): Promise<WineDataPoint[]> {
    const { forceReload = false, signal } = options ?? {};

    if (!forceReload) {
      const cached = this.getCachedDataset(dataset);
      if (cached) {
        this.markDatasetSwitchDuration(dataset);
        return cached.data;
      }
    }

    const csvResult = await loadDatasetCsv(dataset, { signal });
    const parsed = parseWineDataset(csvResult.csvText, dataset);

    const datasetPayload: WineDataset = {
      info: parsed.metadata,
      data: parsed.data,
    };

    this.storeInCache(dataset, datasetPayload);
    this.metadataCache.set(dataset, parsed.metadata);

    const metrics: DatasetLoadMetrics = {
      ...csvResult,
      parsedAt: Date.now(),
      anomalyCount: parsed.anomalies.length,
    };

    this.metricsCache.set(dataset, metrics);
    this.anomalyCache.set(dataset, parsed.anomalies);

    this.emit({
      type: 'dataset-loaded',
      dataset,
      info: parsed.metadata,
      metrics,
    });

    return datasetPayload.data;
  }

  getDatasetInfo(dataset: WineDataSet): DatasetInfo | null {
    const cached =
      this.metadataCache.get(dataset) ?? this.getCachedDataset(dataset)?.info;
    return cached ?? null;
  }

  getDataset(dataset: WineDataSet): WineDataset | null {
    return this.getCachedDataset(dataset);
  }

  getLoadMetrics(dataset: WineDataSet): DatasetLoadMetrics | null {
    return this.metricsCache.get(dataset) ?? null;
  }

  getAnomalies(dataset: WineDataSet): ParsedWineDataset['anomalies'] | null {
    return this.anomalyCache.get(dataset) ?? null;
  }

  releaseDataset(dataset: WineDataSet): void {
    this.datasetCache.delete(dataset);
    this.fallbackCache.delete(dataset);
    this.metadataCache.delete(dataset);
    this.metricsCache.delete(dataset);
    this.anomalyCache.delete(dataset);
  }

  applyFilters(
    data: WineDataPoint[],
    filters: FilterCriteria
  ): WineDataPoint[] {
    return data.filter(
      (item) =>
        item.alcohol >= filters.alcohol.min &&
        item.alcohol <= filters.alcohol.max &&
        item.pH >= filters.pH.min &&
        item.pH <= filters.pH.max &&
        item.volatileAcidity >= filters.volatileAcidity.min &&
        item.volatileAcidity <= filters.volatileAcidity.max
    );
  }

  sortData(
    data: WineDataPoint[],
    feature: keyof WineDataPoint,
    direction: 'asc' | 'desc' = 'asc'
  ): WineDataPoint[] {
    const sorted = [...data].sort((a, b) => a[feature] - b[feature]);
    return direction === 'desc' ? sorted.reverse() : sorted;
  }

  getFeatureRanges(data: WineDataPoint[]): FilterCriteria {
    if (data.length === 0) {
      return {
        alcohol: { ...DEFAULT_FILTERS.alcohol },
        pH: { ...DEFAULT_FILTERS.pH },
        volatileAcidity: { ...DEFAULT_FILTERS.volatileAcidity },
      };
    }

    const reduceRange = (values: number[]) => ({
      min: Math.min(...values),
      max: Math.max(...values),
    });

    return {
      alcohol: reduceRange(data.map((item) => item.alcohol)),
      pH: reduceRange(data.map((item) => item.pH)),
      volatileAcidity: reduceRange(data.map((item) => item.volatileAcidity)),
    };
  }

  on(
    event: DatasetManagerEvent['type'],
    listener: EventListener<DatasetManagerEvent>
  ): () => void {
    if (event !== 'dataset-loaded') {
      throw new Error(`Unsupported event: ${event}`);
    }

    const typedListener = listener as EventListener<
      Extract<DatasetManagerEvent, { type: 'dataset-loaded' }>
    >;
    this.listeners['dataset-loaded'].add(typedListener);
    return () => {
      this.listeners['dataset-loaded'].delete(typedListener);
    };
  }

  private emit(event: DatasetManagerEvent) {
    if (event.type === 'dataset-loaded') {
      this.listeners['dataset-loaded'].forEach((listener) => listener(event));
    }
  }

  private getCachedDataset(dataset: WineDataSet): WineDataset | null {
    if (typeof WeakRef !== 'undefined') {
      const cachedRef = this.datasetCache.get(dataset);
      if (cachedRef) {
        // Check if it's a WeakRef instance or a direct value
        if ('deref' in cachedRef) {
          const existing = cachedRef.deref();
          if (existing) {
            return existing;
          }
        } else {
          // It's already the direct value
          return cachedRef;
        }
      }
    }

    return this.fallbackCache.get(dataset) ?? null;
  }

  private storeInCache(dataset: WineDataSet, payload: WineDataset) {
    if (typeof WeakRef !== 'undefined') {
      this.datasetCache.set(dataset, new WeakRef(payload));
    } else {
      // For environments that don't support WeakRef
      this.datasetCache.set(dataset, payload);
    }
    this.fallbackCache.set(dataset, payload);
  }

  private markDatasetSwitchDuration(dataset: WineDataSet) {
    const start =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    // Accessing cache ensures dataset is materialised
    this.getCachedDataset(dataset);
    const end =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = end - start;
    if (elapsed > 100) {
    }
  }
}

export const wineDataManager = new WineDataManager();

export function deriveDatasetErrorCode(error: unknown): DatasetErrorCode {
  if (error instanceof DatasetLoadError) {
    return error.code;
  }

  const message = error instanceof Error ? error.message : `${error}`;

  if (message.includes('404')) {
    return 'FILE_NOT_FOUND';
  }
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'NETWORK_ERROR';
  }

  return 'UNKNOWN';
}
