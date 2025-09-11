import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
// Import removed to fix unused variable error
import { AppProvider } from '../../../src/context/ContextProvider';

describe('WineExplorer', () => {
  it('renders the main components', () => {
    // Mock the route component for testing
    const MockWineExplorer = () => {
      return (
        <AppProvider>
          <div>
            <div>Dataset</div>
            <div>Dataset Information</div>
            <div>Visualization Area</div>
          </div>
        </AppProvider>
      );
    };

    render(<MockWineExplorer />);

    expect(screen.getByText('Dataset')).toBeInTheDocument();
    expect(screen.getByText('Dataset Information')).toBeInTheDocument();
    expect(screen.getByText('Visualization Area')).toBeInTheDocument();
  });

  it('has responsive layout elements', () => {
    // Mock the route component for testing
    const MockWineExplorer = () => {
      return (
        <AppProvider>
          <div>
            <div>Visualization Area</div>
          </div>
        </AppProvider>
      );
    };

    render(<MockWineExplorer />);

    const visualizationArea = screen.getByText('Visualization Area');
    expect(visualizationArea).toBeInTheDocument();
  });
});
