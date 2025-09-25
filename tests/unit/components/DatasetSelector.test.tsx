import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

describe('DatasetSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with correct initial state', () => {
    renderWithContext();

    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /red wine dataset/i })
    ).toHaveClass('Mui-selected');
  });

  it('has accessible labels', () => {
    renderWithContext();

    expect(
      screen.getByRole('region', { name: /dataset/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('red wine dataset')).toBeInTheDocument();
    expect(screen.getByLabelText('white wine dataset')).toBeInTheDocument();
    const liveRegion = screen.getByRole('status');
    expect(liveRegion.textContent).toMatch(/dataset/i);
  });

  it('switches dataset on toggle click', () => {
    renderWithContext();

    fireEvent.click(
      screen.getByRole('button', { name: /white wine dataset/i })
    );
    expect(mockSwitchDataset).toHaveBeenCalledWith('white');
  });

  it('delays spinner visibility while loading', () => {
    vi.useFakeTimers();

    const contextValue = {
      ...baseContext,
      loading: true,
      loadStatus: 'loading',
    } as any;
    renderWithContext(contextValue);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message and retry button when error occurs', () => {
    const normalizedError = {
      title: 'Unable to load dataset',
      description: 'Network issue',
      retryable: true,
    };

    const contextValue2 = {
      ...baseContext,
      loadStatus: 'error',
      error: normalizedError,
    } as any;
    renderWithContext(contextValue2);

    expect(screen.getByText(/Unable to load dataset/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRetryLoad).toHaveBeenCalled();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithContext();

    const redButton = screen.getByRole('button', { name: /red wine dataset/i });
    const whiteButton = screen.getByRole('button', {
      name: /white wine dataset/i,
    });

    redButton.focus();
    expect(redButton).toHaveFocus();

    await user.keyboard('[ArrowRight]');
    await user.click(whiteButton);
    expect(mockSwitchDataset).toHaveBeenCalledWith('white');
  });
});
