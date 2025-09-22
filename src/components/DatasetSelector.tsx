import React, { useContext } from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { WineDataContext } from '../context/WineDataContext';
import { useEffect } from 'react';

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

  const { currentDataset, switchDataset, loading, error } = context;

  useEffect(() => {
    const announcementDiv = document.getElementById(
      'screen-reader-announcement'
    );
    if (announcementDiv) {
      if (loading) {
        announcementDiv.textContent = `Switching to ${currentDataset} wine dataset. Loading ${currentDataset === 'red' ? '1,599' : '4,898'} instances.`;
      } else if (error) {
        announcementDiv.textContent = `Error loading ${currentDataset} wine dataset.`;
      } else {
        announcementDiv.textContent = `${currentDataset} wine dataset loaded.`;
      }
    }
  }, [loading, currentDataset, error]);

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
      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => switchDataset(currentDataset)}
            >
              Retry
            </Button>
          }
        >
          Error loading data. Please try again.
        </Alert>
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
      />
    </Stack>
  );
};
