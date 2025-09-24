import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
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

export interface FilterPanelProps {
  className?: string;
}

/**
 * Component for filtering wine data by physicochemical features
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ className }) => {
  const context = useContext(WineDataContext);
  const announcementRef = useRef<HTMLDivElement>(null);

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
  } = context;

  // Local state for slider values to enable debouncing
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local state when context filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Announce filter changes for screen readers
  useEffect(() => {
    if (announcementRef.current) {
      const totalFiltered = context.filteredData.length;
      announcementRef.current.textContent = `Filters updated. ${totalFiltered} instances shown.`;
    }
  }, [context.filteredData.length]);

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
        sx={{
          backgroundColor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" component="h3">
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
            <Typography variant="h6" component="h3">
              Filters
            </Typography>
            <Box display="flex" alignItems="center" gap={1.5}>
              {(loading || isFiltering) && !showSkeleton && (
                <Box display="flex" alignItems="center" gap={1}>
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
              <Box>
                <Typography variant="subtitle2" component="h4" gutterBottom>
                  Alcohol Content
                </Typography>
                <RangeSlider
                  min={featureRanges.alcohol.min}
                  max={featureRanges.alcohol.max}
                  value={[localFilters.alcohol.min, localFilters.alcohol.max]}
                  onChange={handleAlcoholChange}
                  valueLabelDisplay="auto"
                  disabled={controlsDisabled}
                  getAriaLabel={() => 'Alcohol content range'}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption">
                    {localFilters.alcohol.min.toFixed(1)}
                  </Typography>
                  <Typography variant="caption">
                    {localFilters.alcohol.max.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" component="h4" gutterBottom>
                  pH Level
                </Typography>
                <RangeSlider
                  min={featureRanges.pH.min}
                  max={featureRanges.pH.max}
                  value={[localFilters.pH.min, localFilters.pH.max]}
                  onChange={handlePHChange}
                  valueLabelDisplay="auto"
                  disabled={controlsDisabled}
                  getAriaLabel={() => 'pH level range'}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption">
                    {localFilters.pH.min.toFixed(1)}
                  </Typography>
                  <Typography variant="caption">
                    {localFilters.pH.max.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" component="h4" gutterBottom>
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
                  getAriaLabel={() => 'Volatile acidity range'}
                />
                <Box display="flex" justifyContent="space-between" mt={1}>
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
        <div
          ref={announcementRef}
          aria-live="polite"
          aria-atomic="true"
          style={{ position: 'absolute', left: '-10000px' }}
        />
      </CardContent>
    </Card>
  );
};
