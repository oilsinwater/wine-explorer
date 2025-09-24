import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { WineDataPoint, WineDataSet } from '../types/wine';
import { wineDataManager, FilterCriteria } from '../utils/WineDataManager';
import {
  DatasetLoadError,
  NormalizedAppError,
  toNormalizedError,
} from '../utils/errors';
import { errorLogger } from '../utils/errorLogger';

interface WineDataContextType {
  wineData: WineDataPoint[];
  filteredData: WineDataPoint[];
  currentDataset: WineDataSet;
  loadStatus: 'idle' | 'loading' | 'ready' | 'error';
  loading: boolean;
  isFiltering: boolean;
  error: NormalizedAppError | null;
  filters: FilterCriteria;
  switchDataset: (dataSet: WineDataSet) => void;
  updateFilters: (newFilters: Partial<FilterCriteria>) => void;
  clearFilters: () => void;
  featureRanges: FilterCriteria;
  retryLoad: () => void;
  lastLoadedAt: number | null;
}

export const WineDataContext = createContext<WineDataContextType | undefined>(
  undefined
);

const DEFAULT_FILTERS: FilterCriteria = {
  alcohol: { min: 8.0, max: 14.0 },
  pH: { min: 2.7, max: 4.0 },
  volatileAcidity: { min: 0.1, max: 1.2 },
};

const cloneFilters = (filters: FilterCriteria): FilterCriteria => ({
  alcohol: { ...filters.alcohol },
  pH: { ...filters.pH },
  volatileAcidity: { ...filters.volatileAcidity },
});

export const WineDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wineData, setWineData] = useState<WineDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<WineDataPoint[]>([]);
  const [currentDataset, setCurrentDataset] = useState<WineDataSet>('red');
  const [loadStatus, setLoadStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('loading');
  const [isFiltering, setIsFiltering] = useState(false);
  const [errorDetails, setErrorDetails] = useState<NormalizedAppError | null>(
    null
  );
  const [filters, setFilters] = useState<FilterCriteria>(
    cloneFilters(DEFAULT_FILTERS)
  );
  const [featureRanges, setFeatureRanges] = useState<FilterCriteria>(
    cloneFilters(DEFAULT_FILTERS)
  );
  const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(null);

  const filterQueryKeys = useMemo(
    () => ({
      alcoholMin: 'alcoholMin',
      alcoholMax: 'alcoholMax',
      pHMin: 'pHMin',
      pHMax: 'pHMax',
      volatileAcidityMin: 'volatileAcidityMin',
      volatileAcidityMax: 'volatileAcidityMax',
    }),
    []
  );

  const filtersEqual = useCallback(
    (a: FilterCriteria, b: FilterCriteria) =>
      a.alcohol.min === b.alcohol.min &&
      a.alcohol.max === b.alcohol.max &&
      a.pH.min === b.pH.min &&
      a.pH.max === b.pH.max &&
      a.volatileAcidity.min === b.volatileAcidity.min &&
      a.volatileAcidity.max === b.volatileAcidity.max,
    []
  );

  const parseFiltersFromSearch = useCallback(
    (ranges: FilterCriteria): FilterCriteria | null => {
      if (typeof window === 'undefined') {
        return null;
      }

      const params = new URLSearchParams(window.location.search);
      const alcoholMinParam = params.get(filterQueryKeys.alcoholMin);
      const alcoholMaxParam = params.get(filterQueryKeys.alcoholMax);
      const pHMinParam = params.get(filterQueryKeys.pHMin);
      const pHMaxParam = params.get(filterQueryKeys.pHMax);
      const volatileMinParam = params.get(filterQueryKeys.volatileAcidityMin);
      const volatileMaxParam = params.get(filterQueryKeys.volatileAcidityMax);

      if (
        !alcoholMinParam &&
        !alcoholMaxParam &&
        !pHMinParam &&
        !pHMaxParam &&
        !volatileMinParam &&
        !volatileMaxParam
      ) {
        return null;
      }

      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

      const safeNumber = (value: string | null) => {
        if (!value) {
          return null;
        }
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
      };

      const alcoholMin = safeNumber(alcoholMinParam);
      const alcoholMax = safeNumber(alcoholMaxParam);
      const pHMin = safeNumber(pHMinParam);
      const pHMax = safeNumber(pHMaxParam);
      const volatileMin = safeNumber(volatileMinParam);
      const volatileMax = safeNumber(volatileMaxParam);

      const nextFilters: FilterCriteria = {
        alcohol: {
          min: clamp(
            alcoholMin ?? ranges.alcohol.min,
            ranges.alcohol.min,
            ranges.alcohol.max
          ),
          max: clamp(
            alcoholMax ?? ranges.alcohol.max,
            ranges.alcohol.min,
            ranges.alcohol.max
          ),
        },
        pH: {
          min: clamp(pHMin ?? ranges.pH.min, ranges.pH.min, ranges.pH.max),
          max: clamp(pHMax ?? ranges.pH.max, ranges.pH.min, ranges.pH.max),
        },
        volatileAcidity: {
          min: clamp(
            volatileMin ?? ranges.volatileAcidity.min,
            ranges.volatileAcidity.min,
            ranges.volatileAcidity.max
          ),
          max: clamp(
            volatileMax ?? ranges.volatileAcidity.max,
            ranges.volatileAcidity.min,
            ranges.volatileAcidity.max
          ),
        },
      };

      if (
        nextFilters.alcohol.min > nextFilters.alcohol.max ||
        nextFilters.pH.min > nextFilters.pH.max ||
        nextFilters.volatileAcidity.min > nextFilters.volatileAcidity.max
      ) {
        return ranges;
      }

      return nextFilters;
    },
    [filterQueryKeys]
  );

  const loadDataset = useCallback(
    async (dataset: WineDataSet) => {
      setLoadStatus('loading');
      setIsFiltering(true);
      setErrorDetails(null);

      try {
        const loadWithRetry = async (
          attempt: number
        ): Promise<WineDataPoint[]> => {
          try {
            return await wineDataManager.loadData(dataset);
          } catch (err) {
            const datasetError =
              err instanceof DatasetLoadError
                ? err
                : new DatasetLoadError({
                    code: 'UNKNOWN',
                    dataset,
                    cause: err,
                  });

            if (datasetError.retryable && attempt < 3) {
              const backoff = Math.min(500 * 2 ** (attempt - 1), 2000);
              await new Promise((resolve) => setTimeout(resolve, backoff));
              return loadWithRetry(attempt + 1);
            }

            throw datasetError;
          }
        };

        const data = await loadWithRetry(1);
        setWineData(data);
        const ranges = wineDataManager.getFeatureRanges(data);
        setFeatureRanges(ranges);
        const restoredFilters = parseFiltersFromSearch(ranges) ?? ranges;
        setFilters(restoredFilters);
        setFilteredData(wineDataManager.applyFilters(data, restoredFilters));
        setLoadStatus('ready');
        setLastLoadedAt(Date.now());
      } catch (err) {
        const datasetError = err as DatasetLoadError;

        errorLogger.log(datasetError, {
          scope: 'dataset-load',
          dataset,
        });

        setWineData([]);
        setFilteredData([]);
        setFeatureRanges(cloneFilters(DEFAULT_FILTERS));
        setFilters(cloneFilters(DEFAULT_FILTERS));
        setLoadStatus('error');
        setIsFiltering(false);
        setErrorDetails(toNormalizedError(datasetError));
      }
    },
    [parseFiltersFromSearch]
  );

  // Load data when dataset changes
  useEffect(() => {
    loadDataset(currentDataset);
  }, [currentDataset, loadDataset]);

  // Apply filters when wineData or filters change
  useEffect(() => {
    if (wineData.length === 0) {
      setFilteredData([]);
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    const startTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    const filtered = wineDataManager.applyFilters(wineData, filters);
    setFilteredData(filtered);

    const endTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    const elapsed = endTime - startTime;
    const minimumDelay = 200; // ensure subtle transition per UX spec
    const remaining = Math.max(0, minimumDelay - elapsed);

    const timeout = setTimeout(() => {
      setIsFiltering(false);
    }, remaining);

    return () => {
      clearTimeout(timeout);
    };
  }, [wineData, filters]);

  // Sync filter state with URL query parameters for deep-linking
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const keys = Object.values(filterQueryKeys);
    const originalSearch = params.toString();

    if (filtersEqual(filters, featureRanges)) {
      keys.forEach((key) => params.delete(key));
    } else {
      params.set(filterQueryKeys.alcoholMin, filters.alcohol.min.toFixed(2));
      params.set(filterQueryKeys.alcoholMax, filters.alcohol.max.toFixed(2));
      params.set(filterQueryKeys.pHMin, filters.pH.min.toFixed(2));
      params.set(filterQueryKeys.pHMax, filters.pH.max.toFixed(2));
      params.set(
        filterQueryKeys.volatileAcidityMin,
        filters.volatileAcidity.min.toFixed(2)
      );
      params.set(
        filterQueryKeys.volatileAcidityMax,
        filters.volatileAcidity.max.toFixed(2)
      );
    }

    const nextSearch = params.toString();
    if (nextSearch === originalSearch) {
      return;
    }

    const newUrl = `${window.location.pathname}${
      nextSearch ? `?${nextSearch}` : ''
    }${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters, featureRanges, filterQueryKeys, filtersEqual]);

  const switchDataset = (dataSet: WineDataSet) => {
    setCurrentDataset(dataSet);
  };

  const updateFilters = useCallback((newFilters: Partial<FilterCriteria>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(featureRanges);
  }, [featureRanges]);

  const retryLoad = useCallback(() => {
    loadDataset(currentDataset);
  }, [currentDataset, loadDataset]);

  const loading = loadStatus === 'loading';

  return (
    <WineDataContext.Provider
      value={{
        wineData,
        filteredData,
        currentDataset,
        loadStatus,
        loading,
        isFiltering,
        error: errorDetails,
        filters,
        switchDataset,
        updateFilters,
        clearFilters,
        featureRanges,
        retryLoad,
        lastLoadedAt,
      }}
    >
      {children}
    </WineDataContext.Provider>
  );
};
