import { Box, Container, Stack, styled } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { DatasetSelector } from '../components/DatasetSelector';
import { InfoPanel } from '../components/InfoPanel';

export const Route = createFileRoute('/wine-explorer')({
  component: WineExplorer,
});

/**
 * Wine Explorer page component
 */
function WineExplorer() {
  // Styled components for layout
  const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }));

  const StyledDatasetSelector = styled(DatasetSelector)(({ theme }) => ({
    marginBottom: theme.spacing(3),
  }));

  const StyledInfoPanel = styled(InfoPanel)(({ theme }) => ({
    marginBottom: theme.spacing(3),
  }));

  return (
    <StyledContainer maxWidth="lg">
      <Stack spacing={3}>
        <StyledDatasetSelector />
        <StyledInfoPanel />
        <Box
          sx={{
            height: '400px',
            backgroundColor: 'grey.100',
            border: '1px dashed',
            borderColor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center">
            <Box component="span" sx={{ fontSize: '3rem', display: 'block' }}>
              📊
            </Box>
            <Box
              component="span"
              sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}
            >
              Visualization Area
            </Box>
            <Box component="p" sx={{ color: 'grey.600' }}>
              Charts and graphs will be displayed here
            </Box>
          </Box>
        </Box>
      </Stack>
    </StyledContainer>
  );
}
