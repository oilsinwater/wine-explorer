import React from 'react';
import Plot from 'react-plotly.js';
import { WineDataPoint } from '../../types/wine';
import { useTheme } from '@mui/material/styles';

interface HistogramPlotProps {
  data: WineDataPoint[];
  feature: keyof WineDataPoint;
}

export const HistogramPlot: React.FC<HistogramPlotProps> = ({
  data,
  feature,
}) => {
  const theme = useTheme();
  const xData = data.map((d) => d[feature]);

  const plotData: Plotly.Data[] = [
    {
      x: xData,
      type: 'histogram',
      marker: {
        color: theme.palette.primary.main, // Use primary color from theme
      },
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    title: `Distribution of ${feature}`,
    xaxis: {
      title: feature,
    },
    yaxis: {
      title: 'Count',
    },
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4,
    },
  };

  return (
    <Plot
      data={plotData}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
