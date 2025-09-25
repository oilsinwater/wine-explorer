import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useId,
} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  debounce,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { WineDataContext } from '../context/WineDataContext';
import { RangeSlider } from './RangeSlider';
import { FilterCriteria } from '../utils/WineDataManager';
import { useAccessibility } from '../context/AccessibilityContext';

export interface FilterPanelProps {
  className?: string;
}

/**
 * Component for filtering wine data by physicochemical features
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ className }) => {
  const context = useContext(WineDataContext);
  const { announce } = useAccessibility();
  const sectionLabelId = useId();
  const alcoholLabelId = useId();
  const alcoholValuesId = useId();
  const phLabelId = useId();
  const phValuesId = useId();
  const volatileLabelId = useId();
  const volatileValuesId = useId();
  const statusId = useId();

  if (!context) {
    return <div>Loading...</div>;
  }

  const {
    filters,
    updateFilters,
    clearFilters,
    featureRanges,
    loading,
    isFiltering,
    loadStatus,
    error,
    retryLoad,
    filteredData,
    wineData,
  } = context;

  // Local state for slider values to enable debouncing
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local state when context filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced update function
  const debouncedUpdateFilters = useMemo(
    () =>
      debounce((newFilters: Partial<FilterCriteria>) => {
        updateFilters(newFilters);
      }, 300),
    [updateFilters]
  );

  useEffect(() => {
    return () => {
      const maybeClear = (debouncedUpdateFilters as any)?.clear;
      if (typeof maybeClear === 'function') {
        maybeClear();
      }
    };
  }, [debouncedUpdateFilters]);

  const announceOnChange = useRef(true);

  const filteredCount = filteredData.length;
  const totalCount = wineData.length;

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (
      filters.alcohol.min > featureRanges.alcohol.min ||
      filters.alcohol.max < featureRanges.alcohol.max
    ) {
      count += 1;
    }

    if (
      filters.pH.min > featureRanges.pH.min ||
      filters.pH.max < featureRanges.pH.max
    ) {
      count += 1;
    }

    if (
      filters.volatileAcidity.min > featureRanges.volatileAcidity.min ||
      filters.volatileAcidity.max < featureRanges.volatileAcidity.max
    ) {
      count += 1;
    }

    return count;
  }, [featureRanges, filters]);

  useEffect(() => {
    if (announceOnChange.current) {
      announceOnChange.current = false;
      return;
    }

    announce(
      `${activeFilterCount} filters active. Showing ${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()} wines.`
    );
  }, [announce, activeFilterCount, filteredCount, totalCount]);

  // Handle slider changes
  const handleAlcoholChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const newFilters = { alcohol: { min: newValue[0], max: newValue[1] } };
      setLocalFilters((prev) => ({ ...prev, ...newFilters }));
      debouncedUpdateFilters(newFilters);
    }
  };

  const handlePHChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const newFilters = { pH: { min: newValue[0], max: newValue[1] } };
      setLocalFilters((prev) => ({ ...prev, ...newFilters }));
      debouncedUpdateFilters(newFilters);
    }
  };

  const handleVolatileAcidityChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    if (Array.isArray(newValue)) {
      const newFilters = {
        volatileAcidity: { min: newValue[0], max: newValue[1] },
      };
      setLocalFilters((prev) => ({ ...prev, ...newFilters }));
      debouncedUpdateFilters(newFilters);
    }
  };

  // Reset all filters
  const handleClearFilters = () => {
    clearFilters();
  };

  if (loadStatus === 'error' && error) {
    return (
      <Card
        className={className}
        component="section"
        role="region"
        aria-labelledby={sectionLabelId}
        sx={{
          backgroundColor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" component="h3" id={sectionLabelId}>
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error.description}
            </Typography>
            {error.retryable && (
              <Button variant="contained" onClick={retryLoad}>
                Try loading data again
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const controlsDisabled = loadStatus !== 'ready' || loading;
  const showSkeleton = loadStatus === 'loading';

  return (
    <Card
      className={className}
      component="section"
      role="region"
      aria-labelledby={sectionLabelId}
      aria-describedby={statusId}
      aria-busy={loading || isFiltering}
      sx={{
        backgroundColor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="h3" id={sectionLabelId}>
              Filters
            </Typography>
            <Box display="flex" alignItems="center" gap={1.5}>
              {(loading || isFiltering) && !showSkeleton && (
                <Box display="flex" alignItems="center" gap={1} role="status">
                  <CircularProgress size={18} aria-hidden />
                  <Typography variant="caption" color="text.secondary">
                    {loading ? 'Loading...' : 'Updating...'}
                  </Typography>
                </Box>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                disabled={controlsDisabled}
                aria-label="Clear all filters"
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <Typography
            id={statusId}
            variant="body2"
            component="p"
            role="status"
            aria-live="polite"
            color="text.secondary"
          >
            {activeFilterCount === 0
              ? 'No filters applied.'
              : `${activeFilterCount} filter${
                  activeFilterCount === 1 ? '' : 's'
                } active. Showing ${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()} wines.`}
          </Typography>

          {showSkeleton ? (
            <Stack spacing={3} aria-hidden>
              {[1, 2, 3].map((key) => (
                <Box key={key}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rounded" height={30} sx={{ mt: 1 }} />
                </Box>
              ))}
            </Stack>
          ) : (
            <>
              <Box component="section" aria-labelledby={alcoholLabelId}>
                <Typography
                  variant="subtitle2"
                  component="h4"
                  gutterBottom
                  id={alcoholLabelId}
                >
                  Alcohol Content
                </Typography>
                <RangeSlider
                  min={featureRanges.alcohol.min}
                  max={featureRanges.alcohol.max}
                  value={[localFilters.alcohol.min, localFilters.alcohol.max]}
                  onChange={handleAlcoholChange}
                  valueLabelDisplay="auto"
                  disabled={controlsDisabled}
                  aria-labelledby={alcoholLabelId}
                  aria-describedby={alcoholValuesId}
                  getAriaLabel={() => 'Alcohol content range'}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={1}
                  id={alcoholValuesId}
                >
                  <Typography variant="caption">
                    {localFilters.alcohol.min.toFixed(1)}
                  </Typography>
                  <Typography variant="caption">
                    {localFilters.alcohol.max.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Box component="section" aria-labelledby={phLabelId}>
                <Typography
                  variant="subtitle2"
                  component="h4"
                  gutterBottom
                  id={phLabelId}
                >
                  pH Level
                </Typography>
                <RangeSlider
                  min={featureRanges.pH.min}
                  max={featureRanges.pH.max}
                  value={[localFilters.pH.min, localFilters.pH.max]}
                  onChange={handlePHChange}
                  valueLabelDisplay="auto"
                  disabled={controlsDisabled}
                  aria-labelledby={phLabelId}
                  aria-describedby={phValuesId}
                  getAriaLabel={() => 'pH level range'}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={1}
                  id={phValuesId}
                >
                  <Typography variant="caption">
                    {localFilters.pH.min.toFixed(1)}
                  </Typography>
                  <Typography variant="caption">
                    {localFilters.pH.max.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Box component="section" aria-labelledby={volatileLabelId}>
                <Typography
                  variant="subtitle2"
                  component="h4"
                  gutterBottom
                  id={volatileLabelId}
                >
                  Volatile Acidity
                </Typography>
                <RangeSlider
                  min={featureRanges.volatileAcidity.min}
                  max={featureRanges.volatileAcidity.max}
                  value={[
                    localFilters.volatileAcidity.min,
                    localFilters.volatileAcidity.max,
                  ]}
                  onChange={handleVolatileAcidityChange}
                  valueLabelDisplay="auto"
                  disabled={controlsDisabled}
                  aria-labelledby={volatileLabelId}
                  aria-describedby={volatileValuesId}
                  getAriaLabel={() => 'Volatile acidity range'}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={1}
                  id={volatileValuesId}
                >
                  <Typography variant="caption">
                    {localFilters.volatileAcidity.min.toFixed(2)}
                  </Typography>
                  <Typography variant="caption">
                    {localFilters.volatileAcidity.max.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
