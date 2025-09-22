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

interface WineDataContextType {
  wineData: WineDataPoint[];
  filteredData: WineDataPoint[];
  currentDataset: WineDataSet;
  loading: boolean;
  isFiltering: boolean;
  error: Error | null;
  filters: FilterCriteria;
  switchDataset: (dataSet: WineDataSet) => void;
  updateFilters: (newFilters: Partial<FilterCriteria>) => void;
  clearFilters: () => void;
  featureRanges: FilterCriteria;
}

export const WineDataContext = createContext<WineDataContextType | undefined>(
  undefined
);

export const WineDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wineData, setWineData] = useState<WineDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<WineDataPoint[]>([]);
  const [currentDataset, setCurrentDataset] = useState<WineDataSet>('red');
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterCriteria>({
    alcohol: { min: 8.0, max: 14.0 },
    pH: { min: 2.7, max: 4.0 },
    volatileAcidity: { min: 0.1, max: 1.2 },
  });
  const [featureRanges, setFeatureRanges] = useState<FilterCriteria>({
    alcohol: { min: 8.0, max: 14.0 },
    pH: { min: 2.7, max: 4.0 },
    volatileAcidity: { min: 0.1, max: 1.2 },
  });

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

  // Load data when dataset changes
  useEffect(() => {
    setLoading(true);
    setIsFiltering(true);
    wineDataManager
      .loadData(currentDataset)
      .then((data) => {
        setWineData(data);
        // Update feature ranges based on the new dataset
        const ranges = wineDataManager.getFeatureRanges(data);
        setFeatureRanges(ranges);
        // Attempt to restore filters from URL params when available
        const restoredFilters = parseFiltersFromSearch(ranges) ?? ranges;
        setFilters(restoredFilters);
        setFilteredData(wineDataManager.applyFilters(data, restoredFilters));
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setWineData([]);
        setFilteredData([]);
        setIsFiltering(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentDataset, parseFiltersFromSearch]);

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

  return (
    <WineDataContext.Provider
      value={{
        wineData,
        filteredData,
        currentDataset,
        loading,
        isFiltering,
        error,
        filters,
        switchDataset,
        updateFilters,
        clearFilters,
        featureRanges,
      }}
    >
      {children}
    </WineDataContext.Provider>
  );
};
