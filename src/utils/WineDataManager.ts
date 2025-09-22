import { csv } from 'd3-fetch';
import { WineDataPoint, WineDataSet } from '../types/wine';

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

    const data = await csv(`/data/winequality-${dataSet}.csv`, (d) => {
      return {
        'fixed acidity': +d['fixed acidity']!,
        'volatile acidity': +d['volatile acidity']!,
        'citric acid': +d['citric acid']!,
        'residual sugar': +d['residual sugar']!,
        chlorides: +d.chlorides!,
        'free sulfur dioxide': +d['free sulfur dioxide']!,
        'total sulfur dioxide': +d['total sulfur dioxide']!,
        density: +d.density!,
        pH: +d.pH!,
        sulphates: +d.sulphates!,
        alcohol: +d.alcohol!,
        quality: +d.quality!,
      } as WineDataPoint;
    });

    this.dataCache.set(dataSet, data);
    return data;
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
