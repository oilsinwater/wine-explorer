import React from 'react';
import Plot from 'react-plotly.js';
import { WineDataPoint } from '../../types/wine';
import { useTheme } from '@mui/material/styles';

interface ScatterPlotProps {
  data: WineDataPoint[];
  xFeature: keyof WineDataPoint;
  yFeature: keyof WineDataPoint;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xFeature,
  yFeature,
}) => {
  const theme = useTheme();
  const xData = data.map((d) => d[xFeature]);
  const yData = data.map((d) => d[yFeature]);

  const plotData: Plotly.Data[] = [
    {
      x: xData,
      y: yData,
      mode: 'markers',
      type: 'scatter',
      marker: {
        color: theme.palette.secondary.main, // Use secondary color from theme
        size: 5,
        opacity: 0.7,
      },
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    title: `${yFeature} vs ${xFeature}`,
    xaxis: {
      title: xFeature,
    },
    yaxis: {
      title: yFeature,
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
