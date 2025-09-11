import React from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
} from '@mui/material';
import { useAppState } from '../context/ContextProvider';

export interface DatasetSelectorProps {
  className?: string;
}

/**
 * Component for selecting between red and white wine datasets
 */
export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  className,
}) => {
  const { state, dispatch } = useAppState();

  const handleDatasetChange = (
    event: React.MouseEvent<HTMLElement>,
    newDataset: 'red' | 'white' | null
  ) => {
    if (newDataset !== null) {
      dispatch({ type: 'SET_DATASET', payload: newDataset });

      // Announce dataset change to screen readers
      const announcement = `Switching to ${newDataset} wine dataset.`;
      const announcementElement = document.getElementById(
        'screen-reader-announcement'
      );
      if (announcementElement) {
        announcementElement.textContent = announcement;
      }
    }
  };

  return (
    <Stack spacing={1} className={className}>
      <Typography variant="subtitle2" component="h3">
        Dataset
      </Typography>
      <ToggleButtonGroup
        value={state.currentDataset}
        exclusive
        onChange={handleDatasetChange}
        aria-label="dataset selector"
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
      <div
        id="screen-reader-announcement"
        aria-live="polite"
        style={{ position: 'absolute', left: '-10000px' }}
      />
    </Stack>
  );
};
