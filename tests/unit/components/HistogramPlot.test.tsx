import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HistogramPlot } from '../../../src/components/visualizations/HistogramPlot';
import { WineDataPoint } from '../../../src/types/wine.types';

beforeEach(() => {
  vi.resetModules();
});

vi.mock('react-plotly.js', () => ({
  __esModule: true,
  default: (props: any) => {
    return (
      <div
        data-testid={props['data-testid'] ?? 'plotly-mock'}
        aria-label={props['aria-label']}
        aria-describedby={props['aria-describedby']}
      />
    );
  },
}));

describe('HistogramPlot', () => {
  const sampleData: WineDataPoint[] = [
    {
      fixedAcidity: 7.4,
      volatileAcidity: 0.7,
      citricAcid: 0,
      residualSugar: 1.9,
      chlorides: 0.076,
      freeSulfurDioxide: 11,
      totalSulfurDioxide: 34,
      density: 0.9978,
      pH: 3.51,
      sulphates: 0.56,
      alcohol: 9.4,
      quality: 5,
    },
    {
      fixedAcidity: 7.8,
      volatileAcidity: 0.88,
      citricAcid: 0,
      residualSugar: 2.6,
      chlorides: 0.098,
      freeSulfurDioxide: 25,
      totalSulfurDioxide: 67,
      density: 0.9968,
      pH: 3.2,
      sulphates: 0.68,
      alcohol: 9.8,
      quality: 5,
    },
  ];

  it('renders accessible histogram with summary', () => {
    render(<HistogramPlot data={sampleData} feature="alcohol" />);

    const chart = screen.getByLabelText(
      /Histogram showing alcohol distribution/i
    );
    expect(chart).toBeInTheDocument();

    const summary = screen.getByText(/This histogram shows/i);
    expect(summary).toBeInTheDocument();
  });

  it('renders empty state when no data available', () => {
    render(<HistogramPlot data={[]} feature="alcohol" />);

    expect(
      screen.getByText(/No data available for alcohol/i)
    ).toBeInTheDocument();
  });
});
