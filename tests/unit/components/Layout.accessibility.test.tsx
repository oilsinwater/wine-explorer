import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Layout } from '../../../src/components/Layout';
import { AccessibilityProvider } from '../../../src/context/AccessibilityContext';

vi.mock('../../../src/components/AppLink', () => ({
  AppLink: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...props}>{children}</a>
  ),
}));

describe('Layout accessibility features', () => {
  it('exposes a skip link that focuses the main content area', async () => {
    const user = userEvent.setup();

    render(
      <AccessibilityProvider>
        <Layout>
          <button type="button">Focusable child</button>
        </Layout>
      </AccessibilityProvider>
    );

    await user.tab();
    const skipLink = screen.getByRole('link', {
      name: /skip to main content/i,
    });
    expect(skipLink).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(document.activeElement?.id).toBe('main-content');
  });
});
