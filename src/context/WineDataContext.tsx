import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { WineDataPoint, WineDataSet } from '../types/wine';
import { wineDataManager, FilterCriteria } from '../utils/WineDataManager';

interface WineDataContextType {
  wineData: WineDataPoint[];
  filteredData: WineDataPoint[];
  currentDataset: WineDataSet;
  loading: boolean;
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

  // Load data when dataset changes
  useEffect(() => {
    setLoading(true);
    wineDataManager
      .loadData(currentDataset)
      .then((data) => {
        setWineData(data);
        setFilteredData(data);
        // Update feature ranges based on the new dataset
        const ranges = wineDataManager.getFeatureRanges(data);
        setFeatureRanges(ranges);
        // Reset filters to full range
        setFilters(ranges);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setWineData([]);
        setFilteredData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentDataset]);

  // Apply filters when wineData or filters change
  useEffect(() => {
    if (wineData.length > 0) {
      const filtered = wineDataManager.applyFilters(wineData, filters);
      setFilteredData(filtered);
    }
  }, [wineData, filters]);

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
