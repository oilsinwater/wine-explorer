import { describe, it, expect } from 'vitest';
import {
  wineDataManager,
  FilterCriteria,
} from '../../../src/utils/WineDataManager';

describe('WineDataManager filtering', () => {
  // Sample wine data for testing
  const sampleData = [
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
    {
      'fixed acidity': 7.8,
      'volatile acidity': 0.76,
      'citric acid': 0.04,
      'residual sugar': 2.3,
      chlorides: 0.092,
      'free sulfur dioxide': 15,
      'total sulfur dioxide': 54,
      density: 0.997,
      pH: 3.26,
      sulphates: 0.65,
      alcohol: 9.8,
      quality: 5,
    },
  ];

  const testFilters: FilterCriteria = {
    alcohol: { min: 9.5, max: 10.0 },
    pH: { min: 3.2, max: 3.6 },
    volatileAcidity: { min: 0.7, max: 0.9 },
  };

  it('should filter data based on criteria', () => {
    const filteredData = wineDataManager.applyFilters(sampleData, testFilters);

    // Only the second and third items should match all criteria
    expect(filteredData).toHaveLength(2);

    // Check that all items meet the filter criteria
    filteredData.forEach((item) => {
      expect(item.alcohol).toBeGreaterThanOrEqual(testFilters.alcohol.min);
      expect(item.alcohol).toBeLessThanOrEqual(testFilters.alcohol.max);
      expect(item.pH).toBeGreaterThanOrEqual(testFilters.pH.min);
      expect(item.pH).toBeLessThanOrEqual(testFilters.pH.max);
      expect(item['volatile acidity']).toBeGreaterThanOrEqual(
        testFilters.volatileAcidity.min
      );
      expect(item['volatile acidity']).toBeLessThanOrEqual(
        testFilters.volatileAcidity.max
      );
    });
  });

  it('should return all data when filters are at extremes', () => {
    const extremeFilters: FilterCriteria = {
      alcohol: { min: 0, max: 20 },
      pH: { min: 0, max: 14 },
      volatileAcidity: { min: 0, max: 2 },
    };

    const filteredData = wineDataManager.applyFilters(
      sampleData,
      extremeFilters
    );
    expect(filteredData).toHaveLength(sampleData.length);
  });

  it('should return empty array when no data matches filters', () => {
    const restrictiveFilters: FilterCriteria = {
      alcohol: { min: 15, max: 20 },
      pH: { min: 0, max: 1 },
      volatileAcidity: { min: 2, max: 3 },
    };

    const filteredData = wineDataManager.applyFilters(
      sampleData,
      restrictiveFilters
    );
    expect(filteredData).toHaveLength(0);
  });

  it('should calculate correct feature ranges', () => {
    const ranges = wineDataManager.getFeatureRanges(sampleData);

    expect(ranges.alcohol.min).toBe(9.4);
    expect(ranges.alcohol.max).toBe(9.8);
    expect(ranges.pH.min).toBe(3.2);
    expect(ranges.pH.max).toBe(3.51);
    expect(ranges.volatileAcidity.min).toBe(0.7);
    expect(ranges.volatileAcidity.max).toBe(0.88);
  });

  it('should return default ranges for empty data', () => {
    const ranges = wineDataManager.getFeatureRanges([]);

    expect(ranges.alcohol.min).toBe(8.0);
    expect(ranges.alcohol.max).toBe(14.0);
    expect(ranges.pH.min).toBe(2.7);
    expect(ranges.pH.max).toBe(4.0);
    expect(ranges.volatileAcidity.min).toBe(0.1);
    expect(ranges.volatileAcidity.max).toBe(1.2);
  });
});
