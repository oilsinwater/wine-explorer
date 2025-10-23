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
  Box,
} from '@mui/material';
import { WineDataContext } from '../context/WineDataContext';
import { useDelayedVisibility } from '../hooks/useDelayedVisibility';
import { useAccessibility } from '../context/AccessibilityContext';

export interface DatasetSelectorProps {
  className?: string;
}

const CONTROLS_HEIGHT = 40;

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

  const { announce, highContrastEnabled, toggleHighContrast } =
    useAccessibility();
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

  const datasetControl = showSpinner ? (
    <Box
      sx={{
        height: CONTROLS_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        px: 1,
      }}
    >
      <CircularProgress
        size={24}
        aria-live="polite"
        aria-label={`Loading ${datasetMeta.label.toLowerCase()} wine dataset`}
      />
    </Box>
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
      sx={{
        alignItems: 'flex-start',
        flex: 1,
        minHeight: CONTROLS_HEIGHT,
        display: 'flex',
      }}
    >
      <Typography component="span" variant="subtitle2" display="block">
        {error.title}
      </Typography>
      <Typography component="span" variant="body2">
        {error.description}
      </Typography>
    </Alert>
  ) : loadStatus === 'loading' ? (
    <Skeleton
      variant="rounded"
      height={CONTROLS_HEIGHT}
      width={220}
      aria-hidden
    />
  ) : (
    <ToggleButtonGroup
      value={currentDataset}
      exclusive
      onChange={handleDatasetChange}
      aria-labelledby={labelId}
      aria-describedby={statusId}
      disabled={loading}
      sx={{
        height: CONTROLS_HEIGHT,
        flexWrap: 'nowrap',
        '& .MuiToggleButton-root': {
          height: '100%',
          px: 2.5,
        },
      }}
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
            backgroundColor: (theme) => theme.palette.primary.light,
            color: (theme) => theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.main,
            },
          },
        }}
      >
        White
      </ToggleButton>
    </ToggleButtonGroup>
  );

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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{
          width: '100%',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          rowGap: 1.5,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ flexGrow: 1, minWidth: 0, rowGap: 1.5 }}
        >
          <Box
            sx={{
              flex: { xs: 1, sm: '0 0 auto' },
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              minHeight: CONTROLS_HEIGHT,
            }}
          >
            {datasetControl}
          </Box>
          <Button
            variant={highContrastEnabled ? 'outlined' : 'contained'}
            color="primary"
            onClick={toggleHighContrast}
            aria-pressed={highContrastEnabled}
            sx={{
              height: CONTROLS_HEIGHT,
              px: 2.5,
              flex: { xs: 1, sm: '0 0 auto' },
            }}
          >
            {highContrastEnabled ? 'Standard contrast' : 'High contrast'}
          </Button>
        </Stack>
        <Button
          component="a"
          href="https://strudel.science/strudel-kit/docs/"
          variant="outlined"
          color="primary"
          target="_blank"
          rel="noreferrer"
          sx={{
            height: CONTROLS_HEIGHT,
            px: 2.5,
            flex: { xs: 1, sm: '0 0 auto' },
            alignSelf: { xs: 'stretch', sm: 'center' },
            ml: { sm: 'auto' },
          }}
        >
          Help
        </Button>
      </Stack>
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
