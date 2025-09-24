import { WineDataSet } from '../types/wine';

export type DatasetErrorCode =
  | 'NETWORK_ERROR'
  | 'FILE_NOT_FOUND'
  | 'PARSE_ERROR'
  | 'EMPTY_DATASET'
  | 'UNKNOWN';

export interface DatasetErrorOptions {
  code: DatasetErrorCode;
  dataset: WineDataSet;
  message?: string;
  cause?: unknown;
  retryable?: boolean;
  context?: Record<string, unknown>;
}

export class DatasetLoadError extends Error {
  code: DatasetErrorCode;

  dataset: WineDataSet;

  cause?: unknown;

  retryable: boolean;

  context?: Record<string, unknown>;

  constructor({
    code,
    dataset,
    message,
    cause,
    retryable = true,
    context,
  }: DatasetErrorOptions) {
    super(
      message ??
        `Unable to load ${dataset} dataset (${code.toLowerCase().replace(/_/g, ' ')}).`
    );
    this.name = 'DatasetLoadError';
    this.code = code;
    this.dataset = dataset;
    this.cause = cause;
    this.retryable = retryable;
    this.context = context;
  }
}

export interface NormalizedAppError {
  title: string;
  description: string;
  code?: string;
  dataset?: WineDataSet;
  retryable?: boolean;
}

export function toNormalizedError(error: unknown): NormalizedAppError {
  if (error instanceof DatasetLoadError) {
    return {
      title: 'Unable to load dataset',
      description: error.message,
      code: error.code,
      dataset: error.dataset,
      retryable: error.retryable,
    };
  }

  if (error instanceof Error) {
    return {
      title: error.name || 'Unexpected error',
      description: error.message || 'An unexpected error occurred.',
      retryable: true,
    };
  }

  return {
    title: 'Unexpected error',
    description: 'An unknown error occurred.',
    retryable: true,
  };
}
