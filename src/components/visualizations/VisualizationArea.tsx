import React, { useContext, useState } from 'react';
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

  const { filteredData, loading, error } = context;

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

  const availableFeatures: (keyof WineDataPoint)[] =
    filteredData && filteredData.length > 0
      ? (Object.keys(filteredData[0]) as (keyof WineDataPoint)[])
      : [];

  if (loading) {
    return (
      <Box
        sx={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Data...
        </Typography>
      </Box>
    );
  }

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
    <Box sx={{ width: '100%', height: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={selectedVisualization}
          exclusive
          onChange={handleVisualizationChange}
          aria-label="visualization type"
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
              value={selectedXFeature}
              label="Feature"
              onChange={handleXFeatureChange}
            >
              {availableFeatures.map((feature) => (
                <MenuItem key={feature} value={feature}>
                  {feature}
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
                value={selectedXFeature}
                label="X-Axis"
                onChange={handleXFeatureChange}
              >
                {availableFeatures.map((feature) => (
                  <MenuItem key={feature} value={feature}>
                    {feature}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="select-y-feature-label">Y-Axis</InputLabel>
              <Select
                labelId="select-y-feature-label"
                value={selectedYFeature}
                label="Y-Axis"
                onChange={handleYFeatureChange}
              >
                {availableFeatures.map((feature) => (
                  <MenuItem key={feature} value={feature}>
                    {feature}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Stack>

      <Box sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
        {selectedVisualization === 'histogram' ? (
          <HistogramPlot data={filteredData || []} feature={selectedXFeature} />
        ) : (
          <ScatterPlot
            data={filteredData || []}
            xFeature={selectedXFeature}
            yFeature={selectedYFeature}
          />
        )}
      </Box>
    </Box>
  );
};
