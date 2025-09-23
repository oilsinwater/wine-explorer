import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Fade,
  Skeleton,
} from '@mui/material';
import { WineDataContext } from '../../context/WineDataContext';
import { HistogramPlot } from './HistogramPlot';
import { ScatterPlot } from './ScatterPlot';
import { WineDataPoint } from '../../types/wine';

export const VisualizationArea: React.FC = () => {
  const context = useContext(WineDataContext);
  const [selectedVisualization, setSelectedVisualization] = useState<
    'histogram' | 'scatterplot'
  >('histogram');
  const [selectedXFeature, setSelectedXFeature] =
    useState<keyof WineDataPoint>('alcohol');
  const [selectedYFeature, setSelectedYFeature] =
    useState<keyof WineDataPoint>('pH');

  if (!context) {
    return <CircularProgress />;
  }

  const { filteredData, loading, error, isFiltering } = context;

  const availableFeatures = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return [] as (keyof WineDataPoint)[];
    }

    const sample = filteredData[0];
    return (Object.keys(sample) as (keyof WineDataPoint)[]).filter((key) => {
      const value = sample[key];
      return typeof value === 'number';
    });
  }, [filteredData]);

  // Ensure selected feature is valid for the current dataset
  useEffect(() => {
    if (
      !availableFeatures.includes(selectedXFeature) &&
      availableFeatures.length
    ) {
      setSelectedXFeature(availableFeatures[0]);
    }
  }, [availableFeatures, selectedXFeature]);

  useEffect(() => {
    if (
      !availableFeatures.includes(selectedYFeature) &&
      availableFeatures.length
    ) {
      setSelectedYFeature(availableFeatures[0]);
    }
  }, [availableFeatures, selectedYFeature]);

  const skeletonDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skeletonHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skeletonStartRef = useRef<number | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (loading) {
      if (skeletonHideRef.current) {
        clearTimeout(skeletonHideRef.current);
        skeletonHideRef.current = null;
      }

      if (showSkeleton) {
        return;
      }

      skeletonDelayRef.current = setTimeout(() => {
        skeletonStartRef.current =
          typeof performance !== 'undefined' ? performance.now() : Date.now();
        setShowSkeleton(true);
      }, 100);
    } else {
      if (skeletonDelayRef.current) {
        clearTimeout(skeletonDelayRef.current);
        skeletonDelayRef.current = null;
      }

      if (!showSkeleton) {
        skeletonStartRef.current = null;
        return;
      }

      const startedAt =
        skeletonStartRef.current ??
        (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const elapsed =
        (typeof performance !== 'undefined' ? performance.now() : Date.now()) -
        startedAt;
      const remaining = Math.max(0, 300 - elapsed);

      skeletonHideRef.current = setTimeout(() => {
        skeletonStartRef.current = null;
        setShowSkeleton(false);
      }, remaining);
    }

    return () => {
      if (skeletonDelayRef.current) {
        clearTimeout(skeletonDelayRef.current);
        skeletonDelayRef.current = null;
      }
      if (skeletonHideRef.current) {
        clearTimeout(skeletonHideRef.current);
        skeletonHideRef.current = null;
      }
    };
  }, [loading, showSkeleton]);

  const handleVisualizationChange = (
    event: React.MouseEvent<HTMLElement>,
    newVisualization: 'histogram' | 'scatterplot' | null
  ) => {
    if (newVisualization !== null) {
      setSelectedVisualization(newVisualization);
    }
  };

  const handleXFeatureChange = (event: any) => {
    setSelectedXFeature(event.target.value as keyof WineDataPoint);
  };

  const handleYFeatureChange = (event: any) => {
    setSelectedYFeature(event.target.value as keyof WineDataPoint);
  };

  const isDatasetEmpty = !loading && filteredData && filteredData.length === 0;

  const formatFeatureLabel = (feature: keyof WineDataPoint) =>
    feature.toString();

  if (error) {
    return (
      <Box
        sx={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'error.main',
        }}
      >
        <Typography variant="h6">Error loading data:</Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }} aria-busy={loading}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={selectedVisualization}
          exclusive
          onChange={handleVisualizationChange}
          aria-label="visualization type"
          disabled={loading}
        >
          <ToggleButton value="histogram" aria-label="histogram">
            Histogram
          </ToggleButton>
          <ToggleButton value="scatterplot" aria-label="scatterplot">
            Scatter Plot
          </ToggleButton>
        </ToggleButtonGroup>

        {selectedVisualization === 'histogram' && (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-feature-label">Feature</InputLabel>
            <Select
              labelId="select-feature-label"
              value={
                availableFeatures.includes(selectedXFeature)
                  ? selectedXFeature
                  : ''
              }
              label="Feature"
              onChange={handleXFeatureChange}
              disabled={loading || availableFeatures.length === 0}
            >
              {availableFeatures.map((feature) => (
                <MenuItem key={feature} value={feature}>
                  {formatFeatureLabel(feature)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {selectedVisualization === 'scatterplot' && (
          <>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="select-x-feature-label">X-Axis</InputLabel>
              <Select
                labelId="select-x-feature-label"
                value={
                  availableFeatures.includes(selectedXFeature)
                    ? selectedXFeature
                    : ''
                }
                label="X-Axis"
                onChange={handleXFeatureChange}
                disabled={loading || availableFeatures.length === 0}
              >
                {availableFeatures.map((feature) => (
                  <MenuItem key={feature} value={feature}>
                    {formatFeatureLabel(feature)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="select-y-feature-label">Y-Axis</InputLabel>
              <Select
                labelId="select-y-feature-label"
                value={
                  availableFeatures.includes(selectedYFeature)
                    ? selectedYFeature
                    : ''
                }
                label="Y-Axis"
                onChange={handleYFeatureChange}
                disabled={loading || availableFeatures.length === 0}
              >
                {availableFeatures.map((feature) => (
                  <MenuItem key={feature} value={feature}>
                    {formatFeatureLabel(feature)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Stack>

      <Box
        sx={{
          position: 'relative',
          height: 'calc(100% - 60px)',
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Fade
          in={showSkeleton}
          timeout={{ enter: 200, exit: 200 }}
          unmountOnExit
        >
          <Box
            data-testid="visualization-skeleton"
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Skeleton
              variant="rounded"
              animation="wave"
              width="90%"
              height="16%"
              sx={{ maxWidth: 520 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              width="95%"
              height="50%"
              sx={{ maxWidth: 620 }}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              width="70%"
              height="10%"
              sx={{ maxWidth: 460 }}
            />
          </Box>
        </Fade>

        {isFiltering && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.72)',
              zIndex: 1,
            }}
            aria-live="polite"
          >
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Updating visualization...
            </Typography>
          </Box>
        )}
        <Fade
          in={!isFiltering && !showSkeleton}
          timeout={{ enter: 200, exit: 0 }}
          mountOnEnter
          unmountOnExit
        >
          <Box sx={{ height: '100%', width: '100%' }}>
            {isDatasetEmpty ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  textAlign: 'center',
                  px: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No records match the current filters. Adjust filters or switch
                  datasets to see data visualizations.
                </Typography>
              </Box>
            ) : selectedVisualization === 'histogram' ? (
              <HistogramPlot
                data={filteredData || []}
                feature={selectedXFeature}
              />
            ) : (
              <ScatterPlot
                data={filteredData || []}
                xFeature={selectedXFeature}
                yFeature={selectedYFeature}
              />
            )}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};
