import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { useAppState } from '../context/ContextProvider';

export interface InfoPanelProps {
  className?: string;
}

/**
 * Component for displaying dataset metadata information
 */
export const InfoPanel: React.FC<InfoPanelProps> = ({ className }) => {
  const { state } = useAppState();

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

  const currentDataset = datasetInfo[state.currentDataset];

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
        <Stack spacing={1}>
          <Box>
            <Typography variant="subtitle2" component="span">
              Source:{' '}
            </Typography>
            <Typography variant="body2" component="span">
              {currentDataset.source}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" component="span">
              DOI:{' '}
            </Typography>
            <Typography variant="body2" component="span">
              {currentDataset.doi}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" component="span">
              Instances:{' '}
            </Typography>
            <Typography variant="body2" component="span">
              {currentDataset.totalInstances.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
