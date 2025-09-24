import { DatasetLoadError } from './errors';

interface ErrorLogContext {
  scope: string;
  dataset?: string;
  metadata?: Record<string, unknown>;
}

// eslint-disable-next-line no-console
const devConsole = console;

function formatContext(context?: ErrorLogContext | null) {
  if (!context) {
    return '';
  }

  const { scope, dataset, metadata } = context;
  const parts = [`[${scope}]`];
  if (dataset) {
    parts.push(`dataset=${dataset}`);
  }
  if (metadata && Object.keys(metadata).length > 0) {
    parts.push(JSON.stringify(metadata));
  }
  return parts.join(' ');
}

export const errorLogger = {
  log(error: unknown, context?: ErrorLogContext) {
    if (import.meta.env?.MODE !== 'production') {
      devConsole.error(formatContext(context), error);
    }

    if (error instanceof DatasetLoadError) {
      window.dispatchEvent(
        new CustomEvent('app:error', {
          detail: {
            scope: context?.scope ?? 'unknown',
            code: error.code,
            dataset: error.dataset,
            message: error.message,
          },
        })
      );
    }
  },
};
