import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoPanel } from '../../../src/components/InfoPanel';
import { AppProvider } from '../../../src/context/ContextProvider';

describe('InfoPanel', () => {
  it('renders dataset information', () => {
    render(
      <AppProvider>
        <InfoPanel />
      </AppProvider>
    );

    expect(screen.getByText('Dataset Information')).toBeInTheDocument();
    expect(screen.getByText('Source:')).toBeInTheDocument();
    expect(screen.getByText('DOI:')).toBeInTheDocument();
    expect(screen.getByText('Instances:')).toBeInTheDocument();
  });

  it('displays correct information for red wine dataset', () => {
    render(
      <AppProvider>
        <InfoPanel />
      </AppProvider>
    );

    // Initially should show red wine dataset info
    expect(screen.getByText('1,599')).toBeInTheDocument();
  });
});
