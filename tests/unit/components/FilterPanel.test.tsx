import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterPanel } from '../../../src/components/FilterPanel';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataPoint, WineDataSet } from '../../../src/types/wine';

// Mock the debounce function
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...Object.assign({}, actual),
    debounce: (fn: Function) => fn,
  };
});

const mockFilters = {
  alcohol: { min: 9.0, max: 14.0 },
  pH: { min: 3.0, max: 4.0 },
  volatileAcidity: { min: 0.2, max: 1.0 },
};

const mockFeatureRanges = {
  alcohol: { min: 8.0, max: 14.0 },
  pH: { min: 2.7, max: 4.0 },
  volatileAcidity: { min: 0.1, max: 1.2 },
};

const mockContext = {
  wineData: [] as WineDataPoint[],
  filteredData: [] as WineDataPoint[],
  currentDataset: 'red' as WineDataSet,
  loadStatus: 'ready' as const,
  loading: false,
  isFiltering: false,
  error: null,
  filters: mockFilters,
  featureRanges: mockFeatureRanges,
  switchDataset: vi.fn(),
  updateFilters: vi.fn(),
  clearFilters: vi.fn(),
  retryLoad: vi.fn(),
  lastLoadedAt: null as number | null,
};

const renderWithContext = () => {
  return render(
    <WineDataContext.Provider value={mockContext}>
      <FilterPanel />
    </WineDataContext.Provider>
  );
};

describe('FilterPanel', () => {
  it('renders filter panel with correct labels', () => {
    renderWithContext();

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Alcohol Content')).toBeInTheDocument();
    expect(screen.getByText('pH Level')).toBeInTheDocument();
    expect(screen.getByText('Volatile Acidity')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('displays correct filter values', () => {
    renderWithContext();

    // Check alcohol filter values
    expect(screen.getByText('9.0')).toBeInTheDocument();
    expect(screen.getByText('14.0')).toBeInTheDocument();

    // Check pH filter values
    expect(screen.getByText('3.0')).toBeInTheDocument();
    expect(screen.getByText('4.0')).toBeInTheDocument();

    // Check volatile acidity filter values
    expect(screen.getByText('0.20')).toBeInTheDocument();
    expect(screen.getByText('1.00')).toBeInTheDocument();
  });

  it('calls clearFilters when Clear All button is clicked', () => {
    renderWithContext();

    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    expect(mockContext.clearFilters).toHaveBeenCalled();
  });

  it('disables buttons when loading', () => {
    render(
      <WineDataContext.Provider
        value={{ ...mockContext, loading: true, loadStatus: 'loading' }}
      >
        <FilterPanel />
      </WineDataContext.Provider>
    );

    const clearButton = screen.getByText('Clear All');
    expect(clearButton).toBeDisabled();
  });

  it('shows filtering indicator when filters are updating', () => {
    render(
      <WineDataContext.Provider value={{ ...mockContext, isFiltering: true }}>
        <FilterPanel />
      </WineDataContext.Provider>
    );

    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });

  it('renders loading state while dataset is loading', () => {
    render(
      <WineDataContext.Provider
        value={{ ...mockContext, loadStatus: 'loading', loading: true }}
      >
        <FilterPanel />
      </WineDataContext.Provider>
    );

    expect(screen.getByText('Clear All')).toBeDisabled();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  });

  it('shows retry message when dataset fails to load', () => {
    const error = {
      title: 'Unable to load dataset',
      description: 'Network issue',
      retryable: true,
    };

    const retry = vi.fn();
    render(
      <WineDataContext.Provider
        value={{
          ...mockContext,
          loadStatus: 'error',
          error,
          retryLoad: retry,
        }}
      >
        <FilterPanel />
      </WineDataContext.Provider>
    );

    expect(screen.getByText(/Network issue/i)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: /Try loading data again/i })
    );
    expect(retry).toHaveBeenCalled();
  });
});
