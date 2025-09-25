import React, { useContext, useEffect, useMemo, useRef, useId } from 'react';
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
import { useAccessibility } from '../context/AccessibilityContext';

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
    wineData,
  } = context;

  const { announce } = useAccessibility();
  const labelId = useId();
  const statusId = useId();
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

  const totalInstances = wineData.length || datasetMeta.count;

  const statusMessage = useMemo(() => {
    if (loading) {
      return `Loading ${datasetMeta.label.toLowerCase()} wine dataset. ${datasetMeta.count.toLocaleString()} instances expected.`;
    }

    if (loadStatus === 'error' && error) {
      return `Unable to load ${datasetMeta.label.toLowerCase()} wine dataset. ${error.description}`;
    }

    if (loadStatus === 'ready') {
      const loadedPrefix = lastLoadedAt
        ? new Date(lastLoadedAt).toLocaleTimeString()
        : 'now';
      return `${datasetMeta.label} wine dataset ready as of ${loadedPrefix}. ${totalInstances.toLocaleString()} instances available.`;
    }

    return `${datasetMeta.label} wine dataset status pending.`;
  }, [
    datasetMeta.count,
    datasetMeta.label,
    error,
    lastLoadedAt,
    loadStatus,
    loading,
    totalInstances,
  ]);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (loading) {
      announce(
        `Switching to ${datasetMeta.label.toLowerCase()} wine dataset. ${datasetMeta.count.toLocaleString()} instances loading.`
      );
      return;
    }

    if (loadStatus === 'error' && error) {
      announce(
        `Error: Unable to load ${datasetMeta.label.toLowerCase()} dataset. ${error.description}`,
        'assertive'
      );
      return;
    }

    if (loadStatus === 'ready') {
      announce(
        `${datasetMeta.label} wine dataset loaded. ${totalInstances.toLocaleString()} instances available.`
      );
    }
  }, [
    announce,
    datasetMeta.count,
    datasetMeta.label,
    error,
    loadStatus,
    loading,
    totalInstances,
  ]);

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
    <Stack
      spacing={1.5}
      className={className}
      role="region"
      aria-labelledby={labelId}
    >
      <Typography variant="subtitle2" component="h3" id={labelId}>
        Dataset
      </Typography>
      {showSpinner ? (
        <CircularProgress
          size={24}
          aria-live="polite"
          aria-label={`Loading ${datasetMeta.label.toLowerCase()} wine dataset`}
        />
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
        <Skeleton variant="rounded" height={36} width={220} aria-hidden />
      ) : (
        <ToggleButtonGroup
          value={currentDataset}
          exclusive
          onChange={handleDatasetChange}
          aria-labelledby={labelId}
          aria-describedby={statusId}
          disabled={loading}
        >
          <ToggleButton
            value="red"
            aria-label="red wine dataset"
            sx={{
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.dark,
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
                backgroundColor: (theme) => theme.palette.secondary.main,
                color: (theme) => theme.palette.secondary.contrastText,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.secondary.dark,
                },
              },
            }}
          >
            White
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      <Typography
        id={statusId}
        variant="caption"
        component="p"
        role="status"
        aria-live="polite"
        color="text.secondary"
      >
        {statusMessage}
      </Typography>
    </Stack>
  );
};
