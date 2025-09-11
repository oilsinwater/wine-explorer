import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatasetSelector } from '../../../src/components/DatasetSelector';
import { AppProvider } from '../../../src/context/ContextProvider';

describe('DatasetSelector', () => {
  it('renders with correct initial state', () => {
    render(
      <AppProvider>
        <DatasetSelector />
      </AppProvider>
    );

    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
  });

  it('has accessible labels', () => {
    render(
      <AppProvider>
        <DatasetSelector />
      </AppProvider>
    );

    expect(screen.getByLabelText('dataset selector')).toBeInTheDocument();
    expect(screen.getByLabelText('red wine dataset')).toBeInTheDocument();
    expect(screen.getByLabelText('white wine dataset')).toBeInTheDocument();
  });
});
