import React, { useContext, useId, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { WineDataContext } from '../context/WineDataContext';

export interface InfoPanelProps {
  className?: string;
}

/**
 * Component for displaying dataset metadata information
 */
export const InfoPanel: React.FC<InfoPanelProps> = ({ className }) => {
  const context = useContext(WineDataContext);
  const sectionLabelId = useId();
  const statusId = useId();

  if (!context) {
    return <CircularProgress />;
  }

  const {
    currentDataset,
    wineData,
    filteredData,
    loadStatus,
    error,
    isFiltering,
    retryLoad,
    lastLoadedAt,
    datasetMetadata,
    loadMetrics,
  } = context;
  const currentDatasetInfo = useMemo(() => {
    const fallback = {
      source: 'UCI Machine Learning Repository',
      doi: '10.24432/C56S3T',
      totalInstances: wineData.length,
      features: [
        'fixed acidity',
        'volatile acidity',
        'citric acid',
        'residual sugar',
        'chlorides',
        'free sulfur dioxide',
        'total sulfur dioxide',
        'density',
        'pH',
        'sulphates',
        'alcohol',
        'quality',
      ],
    };
    return datasetMetadata[currentDataset] ?? fallback;
  }, [currentDataset, datasetMetadata, wineData.length]);
  const filteredCount = filteredData.length;
  const totalCount = wineData.length;
  const metrics = loadMetrics[currentDataset];

  return (
    <Card
      className={className}
      component="section"
      role="complementary"
      aria-labelledby={sectionLabelId}
      aria-describedby={statusId}
      sx={{
        backgroundColor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          id={sectionLabelId}
        >
          Dataset Information
        </Typography>
        {loadStatus === 'loading' ? (
          <Stack spacing={1} aria-live="polite">
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Stack>
        ) : loadStatus === 'error' && error ? (
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
        ) : (
          <Stack spacing={1}>
            <Box>
              <Typography variant="subtitle2" component="span">
                Source:{' '}
              </Typography>
              <Typography variant="body2" component="span">
                {currentDatasetInfo.source}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" component="span">
                DOI:{' '}
              </Typography>
              <Typography variant="body2" component="span">
                {currentDatasetInfo.doi}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box>
                <Typography variant="subtitle2" component="span">
                  Instances:{' '}
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  id={statusId}
                  role="status"
                  aria-live="polite"
                >
                  {filteredCount.toLocaleString()}
                  {filteredCount !== totalCount && (
                    <span> of {totalCount.toLocaleString()} shown</span>
                  )}
                </Typography>
              </Box>
              {isFiltering && (
                <Box display="inline-flex" alignItems="center" gap={0.5}>
                  <CircularProgress size={12} />
                  <Typography variant="caption" color="text.secondary">
                    Updating...
                  </Typography>
                </Box>
              )}
            </Box>
            {lastLoadedAt && (
              <Typography variant="caption" color="text.secondary">
                Updated {new Date(lastLoadedAt).toLocaleTimeString()}
              </Typography>
            )}
            {metrics && (
              <Typography variant="caption" color="text.secondary">
                Load time: {metrics.durationMs.toFixed(0)}ms · Size:{' '}
                {(metrics.sizeBytes / 1024).toFixed(1)} KB
                {metrics.anomalyCount > 0 && (
                  <span>
                    {' '}
                    · Normalised {metrics.anomalyCount} value
                    {metrics.anomalyCount === 1 ? '' : 's'}
                  </span>
                )}
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
