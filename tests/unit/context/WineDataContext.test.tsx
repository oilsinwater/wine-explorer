import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useContext } from 'react';
import {
  WineDataProvider,
  WineDataContext,
} from '../../../src/context/WineDataContext';
import { wineDataManager } from '../../../src/data/WineDataManager';
import { DatasetLoadError } from '../../../src/utils/errors';

const sampleRow = {
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
};

const ranges = {
  alcohol: { min: 8, max: 14 },
  pH: { min: 2.7, max: 4 },
  volatileAcidity: { min: 0.1, max: 1.2 },
};

const TestConsumer = () => {
  const ctx = useContext(WineDataContext);
  if (!ctx) {
    return null;
  }

  return (
    <div>
      <div data-testid="status">{ctx.loadStatus}</div>
      {ctx.error && (
        <div data-testid="error-description">{ctx.error.description}</div>
      )}
      <button onClick={ctx.retryLoad}>retry</button>
    </div>
  );
};

describe('WineDataContext', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads data successfully', async () => {
    vi.spyOn(wineDataManager, 'loadData').mockResolvedValue([sampleRow as any]);
    vi.spyOn(wineDataManager, 'getFeatureRanges').mockReturnValue(ranges);
    vi.spyOn(wineDataManager, 'applyFilters').mockReturnValue([
      sampleRow as any,
    ]);

    render(
      <WineDataProvider>
        <TestConsumer />
      </WineDataProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );
    expect(screen.queryByTestId('error-description')).not.toBeInTheDocument();
  });

  it('exposes retry when dataset load fails and succeeds afterwards', async () => {
    const loadDataSpy = vi
      .spyOn(wineDataManager, 'loadData')
      .mockRejectedValueOnce(
        new DatasetLoadError({
          code: 'NETWORK_ERROR',
          dataset: 'red',
          message: 'Network issue',
        })
      )
      .mockRejectedValueOnce(
        new DatasetLoadError({
          code: 'NETWORK_ERROR',
          dataset: 'red',
          message: 'Network issue',
        })
      )
      .mockRejectedValueOnce(
        new DatasetLoadError({
          code: 'NETWORK_ERROR',
          dataset: 'red',
          message: 'Network issue',
        })
      )
      .mockResolvedValueOnce([sampleRow as any]);

    vi.spyOn(wineDataManager, 'getFeatureRanges').mockReturnValue(ranges);
    vi.spyOn(wineDataManager, 'applyFilters').mockReturnValue([
      sampleRow as any,
    ]);

    render(
      <WineDataProvider>
        <TestConsumer />
      </WineDataProvider>
    );

    await waitFor(
      () => expect(screen.getByTestId('status')).toHaveTextContent('error'),
      { timeout: 2500 }
    );
    expect(screen.getByTestId('error-description')).toHaveTextContent(
      /Network issue/i
    );

    fireEvent.click(screen.getByText('retry'));

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('ready')
    );
    expect(loadDataSpy).toHaveBeenCalledTimes(4);
  });
});
