import { csv } from 'd3-fetch';
import { WineDataPoint, WineDataSet } from '../types/wine';
import { DatasetLoadError, DatasetErrorCode } from './errors';

// Define the filter criteria type
export interface FilterCriteria {
  alcohol: { min: number; max: number };
  pH: { min: number; max: number };
  volatileAcidity: { min: number; max: number };
}

class WineDataManager {
  private dataCache: Map<WineDataSet, WineDataPoint[]> = new Map();

  async loadData(dataSet: WineDataSet): Promise<WineDataPoint[]> {
    if (this.dataCache.has(dataSet)) {
      return this.dataCache.get(dataSet)!;
    }

    try {
      const raw = await csv(`/data/winequality-${dataSet}.csv`);

      if (!raw || raw.length === 0) {
        throw new DatasetLoadError({
          code: 'EMPTY_DATASET',
          dataset: dataSet,
          message: `No records found for ${dataSet} dataset.`,
          retryable: false,
        });
      }

      const data = raw.map((d, index) => {
        const parseNumber = (key: string): number => {
          const value = d[key];
          const parsed = Number.parseFloat(value ?? '');
          if (!Number.isFinite(parsed)) {
            throw new DatasetLoadError({
              code: 'PARSE_ERROR',
              dataset: dataSet,
              message: `Invalid value for “${key}” on row ${index + 1}.`,
              retryable: false,
              context: { key, value, row: index + 1 },
            });
          }
          return parsed;
        };

        return {
          'fixed acidity': parseNumber('fixed acidity'),
          'volatile acidity': parseNumber('volatile acidity'),
          'citric acid': parseNumber('citric acid'),
          'residual sugar': parseNumber('residual sugar'),
          chlorides: parseNumber('chlorides'),
          'free sulfur dioxide': parseNumber('free sulfur dioxide'),
          'total sulfur dioxide': parseNumber('total sulfur dioxide'),
          density: parseNumber('density'),
          pH: parseNumber('pH'),
          sulphates: parseNumber('sulphates'),
          alcohol: parseNumber('alcohol'),
          quality: parseNumber('quality'),
        } as WineDataPoint;
      });

      this.dataCache.set(dataSet, data);
      return data;
    } catch (error) {
      if (error instanceof DatasetLoadError) {
        throw error;
      }

      const code = deriveDatasetErrorCode(error);
      throw new DatasetLoadError({
        code,
        dataset: dataSet,
        cause: error,
        message: createFriendlyMessage(code, dataSet),
      });
    }
  }

  // Apply filters to the wine data
  applyFilters(
    data: WineDataPoint[],
    filters: FilterCriteria
  ): WineDataPoint[] {
    return data.filter((item) => {
      return (
        item.alcohol >= filters.alcohol.min &&
        item.alcohol <= filters.alcohol.max &&
        item.pH >= filters.pH.min &&
        item.pH <= filters.pH.max &&
        item['volatile acidity'] >= filters.volatileAcidity.min &&
        item['volatile acidity'] <= filters.volatileAcidity.max
      );
    });
  }

  // Get min and max values for key features in the dataset
  getFeatureRanges(data: WineDataPoint[]): FilterCriteria {
    if (data.length === 0) {
      return {
        alcohol: { min: 8.0, max: 14.0 },
        pH: { min: 2.7, max: 4.0 },
        volatileAcidity: { min: 0.1, max: 1.2 },
      };
    }

    // Calculate min and max for each feature
    const alcoholValues = data.map((item) => item.alcohol);
    const pHValues = data.map((item) => item.pH);
    const volatileAcidityValues = data.map((item) => item['volatile acidity']);

    return {
      alcohol: {
        min: Math.min(...alcoholValues),
        max: Math.max(...alcoholValues),
      },
      pH: {
        min: Math.min(...pHValues),
        max: Math.max(...pHValues),
      },
      volatileAcidity: {
        min: Math.min(...volatileAcidityValues),
        max: Math.max(...volatileAcidityValues),
      },
    };
  }
}

export const wineDataManager = new WineDataManager();

function deriveDatasetErrorCode(error: unknown): DatasetErrorCode {
  if (error instanceof DatasetLoadError) {
    return error.code;
  }

  const message = error instanceof Error ? error.message : `${error}`;

  if (message.includes('404')) {
    return 'FILE_NOT_FOUND';
  }
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'NETWORK_ERROR';
  }

  return 'UNKNOWN';
}

function createFriendlyMessage(code: DatasetErrorCode, dataset: WineDataSet) {
  switch (code) {
    case 'FILE_NOT_FOUND':
      return `We couldn't find the ${dataset} wine dataset.`;
    case 'NETWORK_ERROR':
      return `Network issue while loading the ${dataset} wine dataset.`;
    case 'PARSE_ERROR':
      return `The ${dataset} wine dataset contains unexpected values.`;
    case 'EMPTY_DATASET':
      return `No data available for the ${dataset} wine dataset.`;
    default:
      return `Something went wrong while loading the ${dataset} wine dataset.`;
  }
}
