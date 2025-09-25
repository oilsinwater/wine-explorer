import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { cleanPath } from '../utils/queryParams.utils';
import { AppLink } from './AppLink';
import { ImageWrapper } from './ImageWrapper';
import { useAccessibility } from '../context/AccessibilityContext';

/**
 * Top navigation bar component
 */
export const TopBar: React.FC = () => {
  const { highContrastEnabled, toggleHighContrast } = useAccessibility();

  return (
    <AppBar
      color="default"
      position="static"
      component="header"
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: (theme) => theme.palette.divider,
        boxShadow: 'none',
      }}
    >
      <Toolbar
        component="nav"
        aria-label="Primary"
        sx={{ alignItems: 'center', gap: 2 }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            gap: 1.5,
          }}
        >
          <AppLink to="/" aria-label="Go to Wine Explorer home">
            <ImageWrapper height={32}>
              <img
                alt="Wine Explorer logo"
                src={cleanPath(
                  `${import.meta.env.BASE_URL}/strudel-logo-icon.png`
                )}
                loading="lazy"
              />
            </ImageWrapper>
          </AppLink>
          <Typography variant="h6" component="p" fontWeight="bold">
            Wine Explorer
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            component="a"
            href="https://strudel.science/docs"
            variant="outlined"
            color="inherit"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </Button>
          <Button
            variant="contained"
            color={highContrastEnabled ? 'secondary' : 'primary'}
            onClick={toggleHighContrast}
            aria-pressed={highContrastEnabled}
          >
            {highContrastEnabled ? 'Standard contrast' : 'High contrast'}
          </Button>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="Account settings"
          >
            <AccountCircleIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
