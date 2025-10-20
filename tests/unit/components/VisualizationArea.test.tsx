import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VisualizationArea } from '../../../src/components/visualizations/VisualizationArea';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataSet } from '../../../src/types/wine';
import { WineDataPoint } from '../../../src/types/wine.types';

// Mock Plotly.js to avoid actual rendering issues in tests
vi.mock('react-plotly.js', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="mock-plot" />),
}));

const mockWineData: WineDataPoint[] = [
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
  wineData: mockWineData,
  filteredData: mockWineData,
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
  updateFilters: vi.fn(),
  clearFilters: vi.fn(),
  featureRanges: {
    alcohol: { min: 8.0, max: 14.0 },
    pH: { min: 2.7, max: 4.0 },
    volatileAcidity: { min: 0.1, max: 1.2 },
  },
  retryLoad: vi.fn(),
  lastLoadedAt: null,
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

describe('VisualizationArea', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockContext = {
    wineData: mockWineData,
    filteredData: mockWineData,
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
    updateFilters: vi.fn(),
    clearFilters: vi.fn(),
    featureRanges: {
      alcohol: { min: 8.0, max: 14.0 },
      pH: { min: 2.7, max: 4.0 },
      volatileAcidity: { min: 0.1, max: 1.2 },
    },
    retryLoad: vi.fn(),
    lastLoadedAt: null,
    datasetMetadata: {},
    loadMetrics: {},
  };

  it('shows visualization skeleton with delayed appearance while loading', () => {
    vi.useFakeTimers();
    render(
      <WineDataContext.Provider
        value={{ ...mockContext, loadStatus: 'loading', loading: true }}
      >
        <VisualizationArea />
      </WineDataContext.Provider>
    );

    expect(
      screen.queryByTestId('visualization-skeleton')
    ).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.getByTestId('visualization-skeleton')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('keeps skeleton visible for minimum duration before hiding', () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <WineDataContext.Provider
        value={{ ...mockContext, loadStatus: 'loading', loading: true }}
      >
        <VisualizationArea />
      </WineDataContext.Provider>
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByTestId('visualization-skeleton')).toBeInTheDocument();

    rerender(
      <WineDataContext.Provider
        value={{ ...mockContext, loadStatus: 'ready', loading: false }}
      >
        <VisualizationArea />
      </WineDataContext.Provider>
    );

    // Should remain visible until minimum display time (300ms) elapsed
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByTestId('visualization-skeleton')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.getByTestId('visualization-skeleton').style.opacity).toBe(
      '0'
    );

    vi.useRealTimers();
  });

  it('renders error state', () => {
    const mockError = {
      title: 'Dataset Error',
      description: 'Failed to load dataset',
      retryable: true,
    };
    render(
      <WineDataContext.Provider
        value={{ ...baseContext, loadStatus: 'error', error: mockError }}
      >
        <VisualizationArea />
      </WineDataContext.Provider>
    );
    expect(screen.getByText(/Failed to load dataset/i)).toBeInTheDocument();
  });

  it('renders HistogramPlot by default', () => {
    renderWithContext();

    expect(screen.getByTestId('mock-plot')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /histogram/i })).toHaveClass(
      'Mui-selected'
    );
  });

  it('renders error message when dataset load fails', () => {
    const normalizedError = {
      title: 'Unable to load dataset',
      description: 'Network issue',
      retryable: true,
    };

    const errorContext = {
      ...baseContext,
      loadStatus: 'error',
      error: normalizedError,
    } as any;
    renderWithContext(errorContext);

    expect(screen.getByText(/Network issue/i)).toBeInTheDocument();
  });

  it('displays skeleton while dataset loading', () => {
    vi.useFakeTimers();

    const loadingContext = {
      ...baseContext,
      loadStatus: 'loading',
      loading: true,
    } as any;
    renderWithContext(loadingContext);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByTestId('visualization-skeleton')).toBeInTheDocument();
  });

  it('switches to ScatterPlot when selected', () => {
    renderWithContext();

    fireEvent.click(screen.getByRole('button', { name: /scatterplot/i }));

    expect(screen.getByRole('button', { name: /scatterplot/i })).toHaveClass(
      'Mui-selected'
    );
    expect(screen.getByTestId('mock-plot')).toBeInTheDocument();
  });

  it('shows visualization loading overlay while filtering', () => {
    renderWithContext({ ...baseContext, isFiltering: true });

    expect(screen.getByText('Updating visualization...')).toBeInTheDocument();
  });

  it('shows empty state when no data matches filters', () => {
    renderWithContext({
      ...baseContext,
      filteredData: [],
    });

    const messages = screen.getAllByText(
      /No records match the current filters/i
    );
    expect(messages.length).toBeGreaterThan(0);
  });
});
