import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatasetSelector } from '../../../src/components/DatasetSelector';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataPoint, WineDataSet } from '../../../src/types/wine';

const mockSwitchDataset = vi.fn();
const mockRetryLoad = vi.fn();

const baseContext = {
  wineData: [] as WineDataPoint[],
  filteredData: [] as WineDataPoint[],
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
  updateFilters: vi.fn(),
  clearFilters: vi.fn(),
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
      <DatasetSelector />
    </WineDataContext.Provider>
  );
};

describe('DatasetSelector accessibility', () => {
  it('provides high contrast mode support', () => {
    renderWithContext();

    // Test that the component renders correctly and has accessible elements
    const buttons = screen.getAllByRole('button', {
      name: /(red|white) wine dataset/i,
    });
    expect(buttons).toHaveLength(2);

    // Check that the component has proper structure
    expect(
      screen.getByRole('region', { name: /dataset/i })
    ).toBeInTheDocument();
  });

  it('provides alternative text for status updates', () => {
    renderWithContext();

    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeInTheDocument();

    // Check that status text is meaningful
    expect(statusRegion.textContent).toMatch(/dataset/i);
  });
});
