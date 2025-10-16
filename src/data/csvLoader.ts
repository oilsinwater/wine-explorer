import { DatasetLoadError } from '../utils/errors';
import { WineDataSet } from '../types/wine';

const DATASET_PATHS: Record<WineDataSet, string> = {
  red: '/data/winequality-red.csv',
  white: '/data/winequality-white.csv',
};

export interface CsvLoadResult {
  csvText: string;
  durationMs: number;
  sizeBytes: number;
}

/** Maximum acceptable dataset size in bytes (50MB). */
export const MAX_DATASET_BYTES = 50 * 1024 * 1024;

export async function loadDatasetCsv(
  dataset: WineDataSet,
  options?: { signal?: AbortSignal; maxBytes?: number }
): Promise<CsvLoadResult> {
  const path = DATASET_PATHS[dataset];
  const { signal, maxBytes = MAX_DATASET_BYTES } = options ?? {};
  const start =
    typeof performance !== 'undefined' ? performance.now() : Date.now();

  let response: Response;
  try {
    response = await fetch(path, {
      signal,
      cache: 'force-cache',
    });
  } catch (error) {
    throw new DatasetLoadError({
      code: 'NETWORK_ERROR',
      dataset,
      cause: error,
      retryable: true,
    });
  }

  if (!response.ok) {
    throw new DatasetLoadError({
      code: response.status === 404 ? 'FILE_NOT_FOUND' : 'NETWORK_ERROR',
      dataset,
      message: `Failed to load ${dataset} dataset (HTTP ${response.status}).`,
      retryable: response.status >= 500,
    });
  }

  const csvText = await response.text();
  const end =
    typeof performance !== 'undefined' ? performance.now() : Date.now();
  const durationMs = end - start;

  if (durationMs > 2000) {
  }

  const sizeBytes = new TextEncoder().encode(csvText).length;
  if (sizeBytes > maxBytes) {
    throw new DatasetLoadError({
      code: 'UNKNOWN',
      dataset,
      message: `${dataset} dataset exceeds ${maxBytes / (1024 * 1024)}MB limit.`,
      retryable: false,
    });
  }

  return {
    csvText,
    durationMs,
    sizeBytes,
  };
}
