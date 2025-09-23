import React, { useMemo, useId } from 'react';
import Plot from 'react-plotly.js';
import { WineDataPoint } from '../../types/wine';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface HistogramPlotProps {
  data: WineDataPoint[];
  feature: keyof WineDataPoint;
}

export const HistogramPlot: React.FC<HistogramPlotProps> = ({
  data,
  feature,
}) => {
  const theme = useTheme();
  const accessibleSummaryId = useId();

  const { xData, binSize, summary } = useMemo(() => {
    const values = data
      .map((d) => d[feature])
      .filter((value): value is number => typeof value === 'number');

    if (values.length === 0) {
      return {
        xData: [],
        binSize: undefined,
        summary: 'No data available for histogram.',
      };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    const bins =
      range === 0 ? 1 : Math.max(1, Math.ceil(Math.log2(values.length) + 1));
    const size = range === 0 ? 1 : range / bins;

    const mean =
      values.reduce((acc, current) => acc + current, 0) / values.length;

    const summaryText = `${values.length.toLocaleString()} samples • Min ${min.toFixed(
      2
    )}, Max ${max.toFixed(2)}, Avg ${mean.toFixed(2)}`;

    return {
      xData: values,
      binSize: size,
      summary: summaryText,
    };
  }, [data, feature]);

  if (xData.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available for {feature}.
        </Typography>
      </Box>
    );
  }

  const formattedFeature = feature.toString();
  const plotData: Plotly.Data[] = [
    {
      x: xData,
      type: 'histogram',
      marker: {
        color: theme.palette.primary.main,
        line: {
          color: theme.palette.primary.dark,
          width: 1,
        },
      },
      opacity: 0.9,
      hoverlabel: {
        bgcolor: theme.palette.background.paper,
        font: { color: theme.palette.text.primary },
      },
      hovertemplate:
        `<b>${formattedFeature}</b><br>` +
        'Range start: %{x:.2f}<br>' +
        'Count: %{y}<extra></extra>',
      xbins: binSize
        ? {
            size: Number.isFinite(binSize) ? binSize : undefined,
          }
        : undefined,
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    title: `Distribution of ${formattedFeature}`,
    xaxis: {
      title: formattedFeature,
      automargin: true,
    },
    yaxis: {
      title: 'Count',
      automargin: true,
    },
    autosize: true,
    margin: {
      l: 50,
      r: 30,
      b: 60,
      t: 60,
      pad: 4,
    },
    hovermode: 'closest',
    transition: {
      duration: 200,
      easing: 'cubic-in-out',
    },
  };

  return (
    <>
      <Plot
        aria-label={`Histogram showing ${formattedFeature} distribution`}
        aria-describedby={accessibleSummaryId}
        data={plotData}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        data-testid="histogram-plot"
      />
      <Typography
        id={accessibleSummaryId}
        variant="body2"
        component="div"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {summary}
      </Typography>
    </>
  );
};
