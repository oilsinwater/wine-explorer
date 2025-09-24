import React, { useMemo, useId } from 'react';
import Plot from 'react-plotly.js';
import { WineDataPoint } from '../../types/wine';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

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
  const accessibleSummaryId = useId();

  const { plotData, layout, summary } = useMemo(() => {
    if (data.length === 0) {
      return {
        plotData: [],
        layout: {},
        summary: 'No data available for scatterplot.',
      };
    }

    const xValues = data
      .map((d) => d[xFeature])
      .filter((value): value is number => typeof value === 'number');
    const yValues = data
      .map((d) => d[yFeature])
      .filter((value): value is number => typeof value === 'number');

    const points = Math.min(xValues.length, yValues.length);
    const formattedX = xFeature.toString();
    const formattedY = yFeature.toString();

    const scatterData: Plotly.Data[] = [
      {
        x: xValues,
        y: yValues,
        mode: 'markers',
        type: 'scatter',
        marker: {
          color: theme.palette.secondary.main,
          size: 6,
          opacity: 0.75,
          line: {
            width: 1,
            color: theme.palette.secondary.dark,
          },
        },
        hovertemplate:
          `<b>${formattedY}</b>: %{y:.2f}<br>` +
          `<b>${formattedX}</b>: %{x:.2f}<extra></extra>`,
      },
    ];

    const scatterLayout: Partial<Plotly.Layout> = {
      title: `${formattedY} vs ${formattedX}`,
      hovermode: 'closest',
      xaxis: {
        title: formattedX,
        automargin: true,
      },
      yaxis: {
        title: formattedY,
        automargin: true,
      },
      autosize: true,
      margin: {
        l: 55,
        r: 30,
        b: 60,
        t: 60,
        pad: 4,
      },
      transition: {
        duration: 200,
        easing: 'cubic-in-out',
      },
    };

    const summaryText = `${points.toLocaleString()} points plotted between ${formattedX} and ${formattedY}.`;

    return {
      plotData: scatterData,
      layout: scatterLayout,
      summary: summaryText,
    };
  }, [
    data,
    theme.palette.secondary.dark,
    theme.palette.secondary.main,
    xFeature,
    yFeature,
  ]);

  if (!plotData.length) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 6 }}
      >
        No data available for selected features.
      </Typography>
    );
  }

  const formattedX = xFeature.toString();
  const formattedY = yFeature.toString();

  return (
    <>
      <Plot
        aria-label={`Scatterplot showing relationship between ${formattedX} and ${formattedY}`}
        aria-describedby={accessibleSummaryId}
        data={plotData}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        data-testid="scatter-plot"
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
