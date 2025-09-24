import React, { useContext, useEffect, useMemo, useRef } from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Skeleton,
} from '@mui/material';
import { WineDataContext } from '../context/WineDataContext';
import { useDelayedVisibility } from '../hooks/useDelayedVisibility';

export interface DatasetSelectorProps {
  className?: string;
}

/**
 * Component for selecting between red and white wine datasets
 */
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  className,
}) => {
  const context = useContext(WineDataContext);

  if (!context) {
    return <div>Loading...</div>; // Or some other fallback UI
  }

  const {
    currentDataset,
    switchDataset,
    loading,
    loadStatus,
    error,
    retryLoad,
    lastLoadedAt,
  } = context;

  const announcementRef = useRef<HTMLDivElement | null>(null);
  const errorAlertRef = useRef<HTMLDivElement | null>(null);
  const showSpinner = useDelayedVisibility(loading, {
    enterDelayMs: 100,
    minVisibleMs: 300,
  });

  const datasetMeta = useMemo(() => {
    return currentDataset === 'red'
      ? { label: 'Red', count: 1599 }
      : { label: 'White', count: 4898 };
  }, [currentDataset]);

  useEffect(() => {
    const node = announcementRef.current;
    if (!node) {
      return;
    }

    if (loading) {
      node.textContent = `Loading ${datasetMeta.label.toLowerCase()} wine dataset. ${datasetMeta.count.toLocaleString()} instances.`;
    } else if (loadStatus === 'error' && error) {
      node.textContent = `Error loading ${datasetMeta.label.toLowerCase()} wine dataset. ${error.description}`;
    } else if (loadStatus === 'ready') {
      const loadedPrefix = lastLoadedAt
        ? new Date(lastLoadedAt).toLocaleTimeString()
        : 'now';
      node.textContent = `${datasetMeta.label} wine dataset ready as of ${loadedPrefix}.`;
    }
  }, [loading, loadStatus, currentDataset, datasetMeta, error, lastLoadedAt]);

  useEffect(() => {
    if (loadStatus === 'error' && errorAlertRef.current) {
      errorAlertRef.current.focus();
    }
  }, [loadStatus]);

  const handleDatasetChange = (
    event: React.MouseEvent<HTMLElement>,
    newDataset: 'red' | 'white' | null
  ) => {
    if (newDataset !== null) {
      switchDataset(newDataset);
    }
  };

  return (
    <Stack spacing={1} className={className}>
      <Typography variant="subtitle2" component="h3">
        Dataset
      </Typography>
      {showSpinner ? (
        <CircularProgress size={24} aria-live="polite" />
      ) : loadStatus === 'error' && error ? (
        <Alert
          ref={errorAlertRef}
          tabIndex={-1}
          severity="error"
          role="alert"
          action={
            error.retryable ? (
              <Button color="inherit" size="small" onClick={retryLoad}>
                Retry
              </Button>
            ) : undefined
          }
          sx={{ alignItems: 'flex-start' }}
        >
          <Typography component="span" variant="subtitle2" display="block">
            {error.title}
          </Typography>
          <Typography component="span" variant="body2">
            {error.description}
          </Typography>
        </Alert>
      ) : loadStatus === 'loading' ? (
        <Skeleton variant="rounded" height={36} width={220} />
      ) : (
        <ToggleButtonGroup
          value={currentDataset}
          exclusive
          onChange={handleDatasetChange}
          aria-label="dataset selector"
          disabled={loading}
        >
          <ToggleButton
            value="red"
            aria-label="red wine dataset"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#A23B72', // wine-red color
                color: 'white',
                '&:hover': {
                  backgroundColor: '#8a3260', // slightly darker wine-red
                },
              },
            }}
          >
            Red
          </ToggleButton>
          <ToggleButton
            value="white"
            aria-label="white wine dataset"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#F18F01', // wine-white color
                color: 'white',
                '&:hover': {
                  backgroundColor: '#d98001', // slightly darker wine-white
                },
              },
            }}
          >
            White
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      <div
        id="screen-reader-announcement"
        aria-live="polite"
        data-testid="screen-reader-announcement-region"
        style={{ position: 'absolute', left: '-10000px' }}
        ref={announcementRef}
      />
    </Stack>
  );
};
