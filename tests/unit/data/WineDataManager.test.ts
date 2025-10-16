import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/data/csvLoader', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../src/data/csvLoader')>();
  return {
    ...actual,
    loadDatasetCsv: vi.fn(async () => ({
      csvText: 'mock-data',
      durationMs: 120,
      sizeBytes: 2048,
    })),
  };
});

vi.mock('../../../src/data/parseWineDataset', () => ({
  parseWineDataset: vi.fn((csvText: string, dataset: 'red' | 'white') => ({
    data: SAMPLE_DATA,
    metadata: {
      type: dataset,
      source: 'UCI Machine Learning Repository',
      doi: '10.24432/C56S3T',
      totalInstances: SAMPLE_DATA.length,
      features: SAMPLE_FEATURES,
    },
    anomalies: [],
  })),
}));

import { loadDatasetCsv } from '../../../src/data/csvLoader';
import { parseWineDataset } from '../../../src/data/parseWineDataset';
import {
  WineDataManager,
  FilterCriteria,
  DatasetManagerEvent,
} from '../../../src/data/WineDataManager';
import { WineDataPoint } from '../../../src/types/wine.types';

const SAMPLE_DATA: WineDataPoint[] = [
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

const SAMPLE_FEATURES = [
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
];

describe('WineDataManager', () => {
  let manager: WineDataManager;

  beforeEach(() => {
    manager = new WineDataManager();
    vi.clearAllMocks();
  });

  it('loads dataset, caches metadata, and records metrics', async () => {
    const data = await manager.loadData('red');

    expect(data).toEqual(SAMPLE_DATA);
    expect(manager.getDatasetInfo('red')).toMatchObject({
      type: 'red',
      totalInstances: SAMPLE_DATA.length,
    });
    const metrics = manager.getLoadMetrics('red');
    expect(metrics).not.toBeNull();
    expect(metrics?.durationMs).toBe(120);
    expect(metrics?.sizeBytes).toBe(2048);

    expect(loadDatasetCsv).toHaveBeenCalledTimes(1);
    expect(parseWineDataset).toHaveBeenCalledTimes(1);
  });

  it('uses cached dataset on subsequent loads', async () => {
    await manager.loadData('white');
    await manager.loadData('white');

    expect(loadDatasetCsv).toHaveBeenCalledTimes(1);
    expect(parseWineDataset).toHaveBeenCalledTimes(1);
  });

  it('emits dataset-loaded events', async () => {
    const listener = vi.fn<(event: DatasetManagerEvent) => void>();
    manager.on('dataset-loaded', listener);

    await manager.loadData('red');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toMatchObject({
      type: 'dataset-loaded',
      dataset: 'red',
      info: expect.objectContaining({ type: 'red' }),
    });
  });

  it('filters dataset according to filter criteria', () => {
    const filters: FilterCriteria = {
      alcohol: { min: 9.5, max: 10 },
      pH: { min: 3.2, max: 3.6 },
      volatileAcidity: { min: 0.7, max: 0.9 },
    };

    const filtered = manager.applyFilters(SAMPLE_DATA, filters);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].alcohol).toBeCloseTo(9.8);
  });

  it('derives feature ranges from data', () => {
    const ranges = manager.getFeatureRanges(SAMPLE_DATA);

    expect(ranges.alcohol.min).toBeCloseTo(9.4);
    expect(ranges.alcohol.max).toBeCloseTo(9.8);
    expect(ranges.pH.min).toBeCloseTo(3.2);
    expect(ranges.pH.max).toBeCloseTo(3.51);
    expect(ranges.volatileAcidity.min).toBeCloseTo(0.7);
    expect(ranges.volatileAcidity.max).toBeCloseTo(0.88);
  });

  it('sorts data by feature and direction', () => {
    const asc = manager.sortData(SAMPLE_DATA, 'alcohol', 'asc');
    const desc = manager.sortData(SAMPLE_DATA, 'alcohol', 'desc');

    expect(asc[0].alcohol).toBeLessThanOrEqual(asc[1].alcohol);
    expect(desc[0].alcohol).toBeGreaterThanOrEqual(desc[1].alcohol);
  });
});
