import React, { useContext } from 'react';
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

  // Dataset metadata based on the UCI Wine Quality dataset
  const datasetInfo = {
    red: {
      source: 'UCI Machine Learning Repository',
      doi: '10.24432/C56S3T',
      totalInstances: 1599,
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
    },
    white: {
      source: 'UCI Machine Learning Repository',
      doi: '10.24432/C56S3T',
      totalInstances: 4898,
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
    },
  };

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
  } = context;
  const currentDatasetInfo = datasetInfo[currentDataset];
  const filteredCount = filteredData.length;
  const totalCount = wineData.length;

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
        <Typography variant="h6" component="h3" gutterBottom>
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
                <Typography variant="body2" component="span">
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
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
