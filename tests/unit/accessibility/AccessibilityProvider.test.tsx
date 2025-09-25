import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import {
  AccessibilityProvider,
  useAccessibility,
} from '../../../src/context/AccessibilityContext';

const InteractiveComponent = () => {
  const { announce, toggleHighContrast, highContrastEnabled } =
    useAccessibility();

  return (
    <div>
      <button type="button" onClick={() => announce('Announcement test')}>
        Announce
      </button>
      <button type="button" onClick={toggleHighContrast}>
        Toggle Contrast
      </button>
      <span data-testid="contrast-state">
        {highContrastEnabled ? 'on' : 'off'}
      </span>
    </div>
  );
};

describe('AccessibilityProvider', () => {
  it('announces messages to the polite live region', async () => {
    const user = userEvent.setup();

    render(
      <AccessibilityProvider>
        <InteractiveComponent />
      </AccessibilityProvider>
    );

    await user.click(screen.getByText('Announce'));

    await waitFor(() =>
      expect(screen.getByTestId('live-announcer-polite').textContent).toContain(
        'Announcement test'
      )
    );
  });

  it('toggles high contrast mode and updates document attributes', async () => {
    const user = userEvent.setup();

    render(
      <AccessibilityProvider>
        <InteractiveComponent />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('contrast-state').textContent).toBe('off');

    await user.click(screen.getByText('Toggle Contrast'));

    expect(screen.getByTestId('contrast-state').textContent).toBe('on');
    expect(document.body.dataset.highContrast).toBe('true');
  });
});
