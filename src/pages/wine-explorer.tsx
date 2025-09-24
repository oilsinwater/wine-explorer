import { Box, Container, Grid, styled } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { DatasetSelector } from '../components/DatasetSelector';
import { InfoPanel } from '../components/InfoPanel';
import { VisualizationArea } from '../components/visualizations/VisualizationArea';
import { FilterPanel } from '../components/FilterPanel';

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

  const StyledFilterPanel = styled(FilterPanel)(({ theme }) => ({
    marginBottom: theme.spacing(3),
  }));

  return (
    <StyledContainer maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledDatasetSelector />
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledFilterPanel />
          <StyledInfoPanel />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '600px', width: '100%' }}>
            <VisualizationArea />
          </Box>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
