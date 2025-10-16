import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadDatasetCsv } from '../../../src/data/csvLoader';
import { DatasetLoadError } from '../../../src/utils/errors';

const originalFetch = globalThis.fetch;

describe('loadDatasetCsv', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    }
  });

  it('loads CSV text and measures size/duration', async () => {
    const mockResponse = new Response('col1,col2\n1,2', { status: 200 });
    globalThis.fetch = vi.fn(
      async () => mockResponse
    ) as unknown as typeof fetch;

    const result = await loadDatasetCsv('red', { maxBytes: 1024 });

    expect(result.csvText).toContain('col1,col2');
    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('throws DatasetLoadError for 404 responses', async () => {
    const notFoundResponse = new Response('missing', { status: 404 });
    globalThis.fetch = vi.fn(
      async () => notFoundResponse
    ) as unknown as typeof fetch;

    await expect(loadDatasetCsv('white')).rejects.toMatchObject({
      code: 'FILE_NOT_FOUND',
    });
  });

  it('throws DatasetLoadError when dataset exceeds allowed size', async () => {
    const oversizedBody = 'a'.repeat(10);
    const okResponse = new Response(oversizedBody, { status: 200 });
    globalThis.fetch = vi.fn(async () => okResponse) as unknown as typeof fetch;

    await expect(loadDatasetCsv('red', { maxBytes: 5 })).rejects.toBeInstanceOf(
      DatasetLoadError
    );
  });

  it('normalises network errors', async () => {
    const networkError = new Error('network down');
    globalThis.fetch = vi.fn(() =>
      Promise.reject(networkError)
    ) as unknown as typeof fetch;

    await expect(loadDatasetCsv('red')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      dataset: 'red',
    });
  });

  it('warns when load duration exceeds target threshold', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy.mockReturnValueOnce(0).mockReturnValueOnce(2500);
    globalThis.fetch = vi.fn(
      async () => new Response('a', { status: 200 })
    ) as unknown as typeof fetch;

    await loadDatasetCsv('red', { maxBytes: 1024 });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
    nowSpy.mockRestore();
  });
});
