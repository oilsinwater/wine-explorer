import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme, highContrastTheme } from '../theme';

type PolitenessSetting = 'polite' | 'assertive';

interface AccessibilityContextValue {
  announce: (message: string, politeness?: PolitenessSetting) => void;
  highContrastEnabled: boolean;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
}

const defaultContextValue: AccessibilityContextValue = {
  announce: () => undefined,
  highContrastEnabled: false,
  toggleHighContrast: () => undefined,
  setHighContrast: () => undefined,
};

const HIGH_CONTRAST_STORAGE_KEY = 'wine-explorer-high-contrast';

const AccessibilityContext =
  createContext<AccessibilityContextValue>(defaultContextValue);

/**
 * AccessibilityProvider adds global accessibility utilities like
 * screen reader announcements and high contrast theming.
 */
export const AccessibilityProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);

  // Restore saved high contrast preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedPreference = window.localStorage.getItem(
      HIGH_CONTRAST_STORAGE_KEY
    );
    if (storedPreference === 'true') {
      setHighContrastEnabled(true);
    }
  }, []);

  // Persist and reflect high contrast state
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      HIGH_CONTRAST_STORAGE_KEY,
      highContrastEnabled ? 'true' : 'false'
    );
  }, [highContrastEnabled]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.dataset.highContrast = highContrastEnabled ? 'true' : 'false';

    document.documentElement.style.setProperty(
      '--focus-ring-color',
      highContrastEnabled ? '#ffbf47' : '#005fcc'
    );
  }, [highContrastEnabled]);

  const announce = useCallback(
    (message: string, politeness: PolitenessSetting = 'polite') => {
      const setMessage =
        politeness === 'assertive' ? setAssertiveMessage : setPoliteMessage;

      if (typeof window === 'undefined') {
        setMessage(message);
        return;
      }

      setMessage('');
      window.requestAnimationFrame(() => {
        setMessage(message);
      });
    },
    []
  );

  const toggleHighContrast = useCallback(() => {
    setHighContrastEnabled((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({
      announce,
      highContrastEnabled,
      toggleHighContrast,
      setHighContrast: setHighContrastEnabled,
    }),
    [announce, highContrastEnabled, toggleHighContrast]
  );

  const activeTheme = highContrastEnabled ? highContrastTheme : theme;

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-announcer"
          data-testid="live-announcer-polite"
        >
          {politeMessage}
        </div>
        <div
          aria-live="assertive"
          aria-atomic="true"
          role="alert"
          className="sr-announcer"
          data-testid="live-announcer-assertive"
        >
          {assertiveMessage}
        </div>
      </ThemeProvider>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
