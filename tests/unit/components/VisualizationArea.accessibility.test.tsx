import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisualizationArea } from '../../../src/components/visualizations/VisualizationArea';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataPoint, WineDataSet } from '../../../src/types/wine';

const mockSwitchDataset = vi.fn();
const mockUpdateFilters = vi.fn();
const mockClearFilters = vi.fn();
const mockRetryLoad = vi.fn();

const sampleWineData: WineDataPoint[] = [
  {
    'fixed acidity': 7.4,
    'volatile acidity': 0.7,
    'citric acid': 0,
    'residual sugar': 1.9,
    chlorides: 0.076,
    'free sulfur dioxide': 11,
    'total sulfur dioxide': 34,
    density: 0.9978,
    pH: 3.51,
    sulphates: 0.56,
    alcohol: 9.4,
    quality: 5,
  },
  {
    'fixed acidity': 7.8,
    'volatile acidity': 0.88,
    'citric acid': 0,
    'residual sugar': 2.6,
    chlorides: 0.098,
    'free sulfur dioxide': 25,
    'total sulfur dioxide': 67,
    density: 0.9968,
    pH: 3.2,
    sulphates: 0.68,
    alcohol: 9.8,
    quality: 5,
  },
];

const baseContext = {
  wineData: sampleWineData,
  filteredData: sampleWineData,
  currentDataset: 'red' as WineDataSet,
  loadStatus: 'ready' as const,
  loading: false,
  isFiltering: false,
  error: null,
  switchDataset: mockSwitchDataset,
  filters: {
    alcohol: { min: 8.0, max: 14.0 },
    pH: { min: 2.7, max: 4.0 },
    volatileAcidity: { min: 0.1, max: 1.2 },
  },
  updateFilters: mockUpdateFilters,
  clearFilters: mockClearFilters,
  featureRanges: {
    alcohol: { min: 8.0, max: 14.0 },
    pH: { min: 2.7, max: 4.0 },
    volatileAcidity: { min: 0.1, max: 1.2 },
  },
  retryLoad: mockRetryLoad,
  lastLoadedAt: null as number | null,
};

const renderWithContext = (contextValue = baseContext) => {
  return render(
    <WineDataContext.Provider value={contextValue as any}>
      <VisualizationArea />
    </WineDataContext.Provider>
  );
};

describe('VisualizationArea accessibility', () => {
  it('provides alternative text for visualizations', () => {
    renderWithContext();

    // Check that the visualization area has appropriate ARIA attributes
    const visualizationRegion = screen.getByRole('region', {
      name: /visualization/i,
    });
    expect(visualizationRegion).toBeInTheDocument();
  });

  it('provides meaningful empty state messages', () => {
    const emptyContext = {
      ...baseContext,
      filteredData: [],
      loadStatus: 'ready' as const,
    } as any;

    renderWithContext(emptyContext);

    // Check that empty state message is exposed through the live region
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveTextContent(
      /no records match the current filters/i
    );
  });
});
