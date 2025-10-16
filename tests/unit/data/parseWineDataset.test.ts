import { describe, it, expect, afterEach, vi } from 'vitest';
import Papa from 'papaparse';
import { parseWineDataset } from '../../../src/data/parseWineDataset';
import { DatasetLoadError } from '../../../src/utils/errors';

const BASE_HEADER =
  'fixed acidity,volatile acidity,citric acid,residual sugar,chlorides,free sulfur dioxide,total sulfur dioxide,density,pH,sulphates,alcohol,quality';

describe('parseWineDataset', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses CSV text into WineDataPoint objects with metadata', () => {
    const csv = `${BASE_HEADER}\n7.4,0.7,0,1.9,0.076,11,34,0.9978,3.51,0.56,9.4,5`;

    const result = parseWineDataset(csv, 'red');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].fixedAcidity).toBeCloseTo(7.4);
    expect(result.metadata.totalInstances).toBe(1);
    expect(result.anomalies).toHaveLength(0);
  });

  it('records anomalies and applies defaults for missing values', () => {
    const csv = `${BASE_HEADER}\n7.4,0.7,,1.9,0.076,11,34,0.9978,3.51,0.56,9.4,5`;

    const result = parseWineDataset(csv, 'white');

    expect(result.data[0].citricAcid).toBe(0);
    expect(result.anomalies).toHaveLength(1);
    expect(result.anomalies[0]).toMatchObject({
      column: 'citricAcid',
      reason: 'missing',
    });
  });

  it('throws DatasetLoadError when Papa Parse reports errors', () => {
    vi.spyOn(Papa, 'parse').mockReturnValue({
      data: [],
      errors: [
        {
          type: 'Delimiter',
          code: 'UndetectableDelimiter',
          message: 'delimiter error',
          row: 2,
        },
      ],
      meta: { fields: [] },
    } as unknown as ReturnType<typeof Papa.parse>);

    expect(() => parseWineDataset('bad-data', 'red')).toThrow(DatasetLoadError);
  });
});
