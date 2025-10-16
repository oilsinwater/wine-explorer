import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisualizationArea } from '../../../src/components/visualizations/VisualizationArea';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataSet } from '../../../src/types/wine';
import { WineDataPoint } from '../../../src/types/wine.types';

const mockSwitchDataset = vi.fn();
const mockUpdateFilters = vi.fn();
const mockClearFilters = vi.fn();
const mockRetryLoad = vi.fn();

const sampleWineData: WineDataPoint[] = [
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
  datasetMetadata: {},
  loadMetrics: {},
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
