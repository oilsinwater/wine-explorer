import Papa from 'papaparse';
import { DatasetLoadError } from '../utils/errors';
import { WineDataSet } from '../types/wine';
import { DatasetInfo, WineDataPoint } from '../types/wine.types';

const BASE_METADATA: Record<
  WineDataSet,
  Omit<DatasetInfo, 'totalInstances'>
> = {
  red: {
    type: 'red',
    source: 'UCI Machine Learning Repository',
    doi: '10.24432/C56S3T',
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
  white: {
    type: 'white',
    source: 'UCI Machine Learning Repository',
    doi: '10.24432/C56S3T',
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
};

const DEFAULT_VALUES: WineDataPoint = {
  fixedAcidity: 0,
  volatileAcidity: 0,
  citricAcid: 0,
  residualSugar: 0,
  chlorides: 0,
  freeSulfurDioxide: 0,
  totalSulfurDioxide: 0,
  density: 0,
  pH: 0,
  sulphates: 0,
  alcohol: 0,
  quality: 0,
};

export interface ParsedWineDataset {
  data: WineDataPoint[];
  metadata: DatasetInfo;
  anomalies: {
    row: number;
    column: keyof WineDataPoint;
    rawValue: string | null;
    reason: 'missing' | 'invalid';
  }[];
}

export function parseWineDataset(
  csvText: string,
  dataset: WineDataSet
): ParsedWineDataset {
  const result: Papa.ParseResult<Record<string, string>> = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    worker: false, // Keep synchronous parsing for predictable test behaviour
    dynamicTyping: false,
  });

  if (result.errors && result.errors.length > 0) {
    const firstError = result.errors[0];
    throw new DatasetLoadError({
      code: 'PARSE_ERROR',
      dataset,
      message: `Parsing error on row ${firstError.row ?? 'unknown'}: ${firstError.message}`,
      retryable: false,
      context: {
        code: firstError.code,
        row: firstError.row,
        message: firstError.message,
      },
    });
  }

  const anomalies: ParsedWineDataset['anomalies'] = [];

  const data: WineDataPoint[] = result.data.map((row, index) => {
    const record: Partial<WineDataPoint> = {};

    // Map kebab-case CSV headers to camelCase object properties
    const columnMappings: Record<string, keyof WineDataPoint> = {
      'fixed acidity': 'fixedAcidity',
      'volatile acidity': 'volatileAcidity',
      'citric acid': 'citricAcid',
      'residual sugar': 'residualSugar',
      chlorides: 'chlorides',
      'free sulfur dioxide': 'freeSulfurDioxide',
      'total sulfur dioxide': 'totalSulfurDioxide',
      density: 'density',
      pH: 'pH',
      sulphates: 'sulphates',
      alcohol: 'alcohol',
      quality: 'quality',
    };

    Object.entries(columnMappings).forEach(([csvHeader, objProperty]) => {
      const rawValue = row[csvHeader];
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        anomalies.push({
          row: index + 2, // +2 includes header row and 0-index
          column: objProperty,
          rawValue: rawValue ?? null,
          reason: 'missing',
        });
        record[objProperty] = DEFAULT_VALUES[objProperty];
        return;
      }

      const parsed = Number.parseFloat(rawValue);
      if (!Number.isFinite(parsed)) {
        anomalies.push({
          row: index + 2,
          column: objProperty,
          rawValue,
          reason: 'invalid',
        });
        record[objProperty] = DEFAULT_VALUES[objProperty];
        return;
      }

      record[objProperty] = parsed;
    });

    return record as WineDataPoint;
  });

  const metadata: DatasetInfo = {
    ...BASE_METADATA[dataset],
    totalInstances: data.length,
  };

  return {
    data,
    metadata,
    anomalies,
  };
}
