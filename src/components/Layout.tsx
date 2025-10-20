import { Box } from '@mui/material';
import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { Footer } from './Footer';

/**
 * Basic layout with navbar and footer
 */
export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const mainRef = useRef<HTMLDivElement>(null);

  const focusMainContent = useCallback(() => {
    const mainElement = mainRef.current;
    if (!mainElement) {
      return;
    }

    mainElement.focus({ preventScroll: true });
    if (typeof mainElement.scrollIntoView === 'function') {
      mainElement.scrollIntoView({ block: 'start' });
    }
  }, []);

  const handleSkipToContent = useCallback(
    (
      event:
        | React.MouseEvent<HTMLAnchorElement>
        | React.KeyboardEvent<HTMLAnchorElement>
    ) => {
      event.preventDefault();
      focusMainContent();
    },
    [focusMainContent]
  );

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={handleSkipToContent}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleSkipToContent(event);
          }
        }}
      >
        Skip to main content
      </a>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        <Box
          component="main"
          id="main-content"
          role="main"
          ref={mainRef}
          tabIndex={-1}
          sx={{
            flex: 1,
            outline: 'none',
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </>
  );
};
