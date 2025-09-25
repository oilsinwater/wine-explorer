import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilterPanel } from '../../../src/components/FilterPanel';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataPoint, WineDataSet } from '../../../src/types/wine';

const mockUpdateFilters = vi.fn();
const mockClearFilters = vi.fn();
const mockRetryLoad = vi.fn();

const baseContext = {
  wineData: [] as WineDataPoint[],
  filteredData: [] as WineDataPoint[],
  currentDataset: 'red' as WineDataSet,
  loadStatus: 'ready' as const,
  loading: false,
  isFiltering: false,
  error: null,
  switchDataset: vi.fn(),
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

const contextWithData = {
  ...baseContext,
  wineData: sampleWineData,
  filteredData: sampleWineData,
};

const renderWithContext = (contextValue = contextWithData) => {
  return render(
    <WineDataContext.Provider value={contextValue as any}>
      <FilterPanel />
    </WineDataContext.Provider>
  );
};

describe('FilterPanel accessibility', () => {
  it('provides clear status updates for filter counts', () => {
    renderWithContext();

    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeInTheDocument();

    // Check that status text is meaningful
    expect(statusRegion.textContent).toMatch(/filter/);
  });

  it('provides appropriate ARIA attributes for filter sections', () => {
    renderWithContext();

    // Check that filter sections have proper landmarks
    const sections = screen.getAllByRole('region');
    expect(sections.length).toBeGreaterThanOrEqual(3); // At least 3 filter sections

    // Check that each section has a proper heading
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings.length).toBeGreaterThanOrEqual(3);
  });
});
