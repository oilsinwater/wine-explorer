import { Box } from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';

/**
 * Basic layout without navbar
 */
export const Route = createRootRoute({
  component: () => (
    <Box
      component="main"
      sx={{
        height: '100%',
        paddingBottom: 4,
      }}
    >
      <Outlet />
    </Box>
  ),
});
