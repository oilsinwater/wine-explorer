import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoPanel } from '../../../src/components/InfoPanel';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataSet } from '../../../src/types/wine';
import { WineDataPoint, DatasetInfo } from '../../../src/types/wine.types';
import { DatasetLoadMetrics } from '../../../src/data/WineDataManager';

describe('InfoPanel', () => {
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

  const mockContext = {
    wineData: mockWineData,
    filteredData: mockWineData,
    currentDataset: 'red' as WineDataSet,
    loadStatus: 'ready' as const,
    loading: false,
    isFiltering: false,
    error: null,
    switchDataset: () => {},
    filters: {
      alcohol: { min: 8.0, max: 14.0 },
      pH: { min: 2.7, max: 4.0 },
      volatileAcidity: { min: 0.1, max: 1.2 },
    },
    updateFilters: () => {},
    clearFilters: () => {},
    featureRanges: {
      alcohol: { min: 8.0, max: 14.0 },
      pH: { min: 2.7, max: 4.0 },
      volatileAcidity: { min: 0.1, max: 1.2 },
    },
    retryLoad: () => {},
    lastLoadedAt: null,
    datasetMetadata: {
      red: {
        type: 'red',
        source: 'UCI Machine Learning Repository',
        doi: '10.24432/C56S3T',
        totalInstances: mockWineData.length,
        features: [
          'fixed acidity',
          'volatile acidity',
          'citric acid',
          'residual sugar',
          'chlorides',
          'free sulfur dioxide',
          'total sulfur dioxide',
          'density',
          'pH',
          'sulphates',
          'alcohol',
          'quality',
        ],
      },
    } as Partial<Record<WineDataSet, DatasetInfo>>,
    loadMetrics: {
      red: {
        csvText: 'mock-data',
        durationMs: 42,
        sizeBytes: 2048,
        parsedAt: Date.now(),
        anomalyCount: 0,
      },
    } as Partial<Record<WineDataSet, DatasetLoadMetrics>>,
  };

  it('renders dataset information', () => {
    render(
      <WineDataContext.Provider value={mockContext}>
        <InfoPanel />
      </WineDataContext.Provider>
    );

    expect(screen.getByText('Dataset Information')).toBeInTheDocument();
    expect(screen.getByText('Source:')).toBeInTheDocument();
    expect(screen.getByText('DOI:')).toBeInTheDocument();
    expect(screen.getByText('Instances:')).toBeInTheDocument();
  });

  it('displays correct information for red wine dataset', () => {
    render(
      <WineDataContext.Provider value={mockContext}>
        <InfoPanel />
      </WineDataContext.Provider>
    );

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('2');
  });

  it('displays filtered instance count when filtered', () => {
    const filteredMockContext = {
      ...mockContext,
      filteredData: [mockWineData[0]], // Only one item after filtering
    };

    render(
      <WineDataContext.Provider value={filteredMockContext}>
        <InfoPanel />
      </WineDataContext.Provider>
    );

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('1');
    expect(status).toHaveTextContent('of');
    expect(status).toHaveTextContent('2');
  });

  it('displays loading state when dataset is loading', () => {
    render(
      <WineDataContext.Provider
        value={{ ...mockContext, loading: true, loadStatus: 'loading' }}
      >
        <InfoPanel />
      </WineDataContext.Provider>
    );

    expect(screen.queryByText(/Source:/i)).not.toBeInTheDocument();
  });

  it('displays error message when dataset fails to load', () => {
    const mockError = {
      title: 'Unable to load dataset',
      description: 'Network issue',
      retryable: true,
    };
    render(
      <WineDataContext.Provider
        value={{ ...mockContext, loadStatus: 'error', error: mockError }}
      >
        <InfoPanel />
      </WineDataContext.Provider>
    );

    expect(screen.getByText(/Network issue/i)).toBeInTheDocument();
  });

  it('renders filtering indicator when results are updating', () => {
    render(
      <WineDataContext.Provider value={{ ...mockContext, isFiltering: true }}>
        <InfoPanel />
      </WineDataContext.Provider>
    );

    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });
});
