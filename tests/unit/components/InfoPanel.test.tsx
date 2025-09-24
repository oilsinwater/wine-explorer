import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoPanel } from '../../../src/components/InfoPanel';
import { WineDataContext } from '../../../src/context/WineDataContext';
import { WineDataPoint, WineDataSet } from '../../../src/types/wine';

describe('InfoPanel', () => {
  const mockWineData: WineDataPoint[] = [
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

    // Should show the count of filtered data
    expect(screen.getByText('2')).toBeInTheDocument();
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

    // Should show "1 of 2 shown"
    expect(screen.getByText('1')).toBeInTheDocument();
    // The "2" might be in a separate element, so we'll check for the full text differently
    const instancesElement = screen.getByText('Instances:');
    expect(instancesElement.nextElementSibling).toHaveTextContent('1');
    expect(instancesElement.nextElementSibling).toHaveTextContent('of');
    expect(instancesElement.nextElementSibling).toHaveTextContent('2');
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
