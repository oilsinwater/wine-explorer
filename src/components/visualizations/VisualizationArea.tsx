import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useId,
  useRef,
} from 'react';
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
  Alert,
  Button,
} from '@mui/material';
import { WineDataContext } from '../../context/WineDataContext';
import { HistogramPlot } from './HistogramPlot';
import { ScatterPlot } from './ScatterPlot';
import { WineDataPoint } from '../../types/wine.types';
import { useDelayedVisibility } from '../../hooks/useDelayedVisibility';
import { useAccessibility } from '../../context/AccessibilityContext';

export const VisualizationArea: React.FC = () => {
  const context = useContext(WineDataContext);
  const regionLabelId = useId();
  const descriptionId = useId();
  const { announce } = useAccessibility();
  const hasAnnounced = useRef(false);

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

  const {
    filteredData,
    loading,
    error,
    isFiltering,
    loadStatus,
    retryLoad,
    currentDataset,
  } = context;

  const showSkeleton = useDelayedVisibility(loadStatus === 'loading', {
    enterDelayMs: 100,
    minVisibleMs: 300,
  });

  const datasetError = loadStatus === 'error' && error;
  const datasetReady = loadStatus === 'ready';
  const datasetEmpty = datasetReady && filteredData.length === 0;
  const controlsDisabled = !datasetReady || loading;

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
    if (availableFeatures.length === 0) {
      return;
    }

    if (!availableFeatures.includes(selectedXFeature)) {
      setSelectedXFeature(availableFeatures[0]);
    }
  }, [availableFeatures, selectedXFeature]);

  useEffect(() => {
    if (availableFeatures.length === 0) {
      return;
    }

    if (!availableFeatures.includes(selectedYFeature)) {
      setSelectedYFeature(availableFeatures[0]);
    }
  }, [availableFeatures, selectedYFeature]);

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

  const formatFeatureLabel = (feature: keyof WineDataPoint) =>
    feature.toString();

  const visualizationSummary = useMemo(() => {
    if (!datasetReady) {
      return 'Visualization controls are disabled until the dataset finishes loading.';
    }

    if (datasetEmpty) {
      return 'No records match the current filters. Adjust filters or switch datasets to see data visualizations.';
    }

    if (selectedVisualization === 'histogram') {
      return `Histogram view showing ${filteredData.length.toLocaleString()} wines for the ${formatFeatureLabel(
        selectedXFeature
      )} feature.`;
    }

    return `Scatter plot showing ${filteredData.length.toLocaleString()} wines with ${formatFeatureLabel(
      selectedXFeature
    )} on the x-axis and ${formatFeatureLabel(selectedYFeature)} on the y-axis.`;
  }, [
    datasetEmpty,
    datasetReady,
    filteredData.length,
    selectedVisualization,
    selectedXFeature,
    selectedYFeature,
  ]);

  useEffect(() => {
    if (!datasetReady) {
      return;
    }

    if (datasetEmpty) {
      announce(
        'No records match the current filters. Visualization area is empty.',
        hasAnnounced.current ? 'polite' : 'assertive'
      );
      hasAnnounced.current = true;
      return;
    }

    const visualizationName =
      selectedVisualization === 'histogram' ? 'Histogram' : 'Scatter plot';
    const detail =
      selectedVisualization === 'histogram'
        ? `${formatFeatureLabel(selectedXFeature)} distribution for ${filteredData.length.toLocaleString()} wines.`
        : `${formatFeatureLabel(selectedYFeature)} plotted against ${formatFeatureLabel(
            selectedXFeature
          )} for ${filteredData.length.toLocaleString()} wines.`;

    announce(`${visualizationName} updated. ${detail}`);
    hasAnnounced.current = true;
  }, [
    announce,
    datasetEmpty,
    datasetReady,
    filteredData.length,
    selectedVisualization,
    selectedXFeature,
    selectedYFeature,
  ]);

  if (datasetError && error) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Alert
          severity="error"
          role="alert"
          action={
            error.retryable ? (
              <Button color="inherit" size="small" onClick={retryLoad}>
                Retry
              </Button>
            ) : undefined
          }
        >
          <Typography variant="subtitle2" component="div">
            {error.title}
          </Typography>
          <Typography variant="body2" component="div">
            {error.description}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby={regionLabelId}
      aria-describedby={descriptionId}
      sx={{ width: '100%', height: '100%' }}
      aria-busy={loading}
    >
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h6" component="h3" id={regionLabelId}>
          Visualization
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color="text.secondary"
          id={descriptionId}
          aria-live="polite"
          role="status"
        >
          {datasetReady
            ? `${visualizationSummary} Dataset: ${currentDataset} wine.`
            : 'Dataset is preparing. Visualization controls are disabled.'}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          <ToggleButtonGroup
            value={selectedVisualization}
            exclusive
            onChange={handleVisualizationChange}
            aria-label="Select visualization type"
            disabled={controlsDisabled}
          >
            <ToggleButton value="histogram" aria-label="histogram">
              Histogram
            </ToggleButton>
            <ToggleButton value="scatterplot" aria-label="scatterplot">
              Scatter Plot
            </ToggleButton>
          </ToggleButtonGroup>

          {selectedVisualization === 'histogram' && (
            <FormControl sx={{ minWidth: 160 }} size="small">
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
                disabled={controlsDisabled || availableFeatures.length === 0}
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
              <FormControl sx={{ minWidth: 160 }} size="small">
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
                  disabled={controlsDisabled || availableFeatures.length === 0}
                >
                  {availableFeatures.map((feature) => (
                    <MenuItem key={feature} value={feature}>
                      {formatFeatureLabel(feature)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 160 }} size="small">
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
                  disabled={controlsDisabled || availableFeatures.length === 0}
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
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(17, 17, 17, 0.72)'
                  : 'rgba(255, 255, 255, 0.72)',
              zIndex: 1,
            }}
            aria-live="polite"
            role="status"
          >
            <CircularProgress size={36} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Updating visualization...
            </Typography>
          </Box>
        )}

        <Fade
          in={!isFiltering && !showSkeleton && !datasetError}
          timeout={{ enter: 200, exit: 0 }}
          mountOnEnter
          unmountOnExit
        >
          <Box sx={{ height: '100%', width: '100%' }}>
            {datasetEmpty ? (
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
                data={datasetReady ? filteredData : []}
                feature={selectedXFeature}
              />
            ) : (
              <ScatterPlot
                data={datasetReady ? filteredData : []}
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
