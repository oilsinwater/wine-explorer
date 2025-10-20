import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import TuneIcon from '@mui/icons-material/Tune';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { createFileRoute } from '@tanstack/react-router';
import { alpha } from '@mui/material/styles';
import { AppLink } from '../components/AppLink';
import { ImageWrapper } from '../components/ImageWrapper';
import { cleanPath } from '../utils/queryParams.utils';

export const Route = createFileRoute('/')({
  component: Index,
});

/**
 * Home page component that renders at the root route /
 */
function Index() {
  const featureCards = [
    {
      icon: <InsightsIcon color="primary" fontSize="large" />,
      title: 'Documented datasets',
      description:
        'Red and white wine chemistry records from the UCI repository include citation details, field mappings, and reproducible loading notes.',
    },
    {
      icon: <TuneIcon color="primary" fontSize="large" />,
      title: 'Adjustable parameters',
      description:
        'Keyboard-accessible controls expose physicochemical ranges so researchers can isolate cohorts without leaving the browser.',
    },
    {
      icon: <BarChartIcon color="primary" fontSize="large" />,
      title: 'Comparable visualizations',
      description:
        'Histogram and scatter plot views facilitate side-by-side inspection of distributions and correlations across variables.',
    },
    {
      icon: <AccessibilityNewIcon color="primary" fontSize="large" />,
      title: 'Inclusive presentation',
      description:
        'High-contrast theming, skip links, and semantic annotations support classroom demonstrations and assistive technologies.',
    },
  ];

  const workflowSteps = [
    {
      step: '1',
      title: 'Pick a dataset',
      description:
        'Switch between red and white wine chemistry to instantly reframe the conversation with stakeholders.',
    },
    {
      step: '2',
      title: 'Shape the profile',
      description:
        'Adjust physicochemical ranges to focus on styles like crisp whites or bold reds while counts update live.',
    },
    {
      step: '3',
      title: 'Share the story',
      description:
        'Use the visualization callouts and metadata panel to explain what makes standout vintages memorable.',
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{ xs: 6, md: 8 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Chip
                  label="Project overview"
                  color="secondary"
                  sx={{
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                />
                <Typography
                  component="h1"
                  variant="h2"
                  fontWeight={700}
                  lineHeight={1.1}
                >
                  Wine Explorer: Physicochemical reference interface
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 540,
                  }}
                >
                  This single-page application accompanies the Wine Explorer
                  PRD, providing a reserved, academically oriented surface for
                  studying the UCI wine quality datasets. Use it to demonstrate
                  filtering strategies, visual analysis workflows, and
                  accessibility considerations in an instructional setting.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={AppLink}
                    to="/wine-explorer"
                    variant="contained"
                    size="large"
                    color="primary"
                  >
                    Open analysis workspace
                  </Button>
                  <Button
                    component="a"
                    href="https://strudel.science/docs"
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: (theme) =>
                        alpha(theme.palette.text.primary, 0.35),
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'text.primary',
                        color: 'text.primary',
                      },
                    }}
                  >
                    View methodology notes
                  </Button>
                </Stack>
                <Paper
                  elevation={0}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 2.5,
                    maxWidth: 520,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Core materials
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        Dataset citation: Cortez et al., 2009 (DOI:
                        10.24432/C56S3T)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Variables: 11 physicochemical measurements with quality
                        scores
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Purpose: Illustrate data storytelling patterns for wine
                        programs within the Strudel Kit architecture.
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 6, md: 8 },
        }}
      >
        <Stack spacing={6}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              About the interface
            </Typography>
            <Typography variant="h4" component="h2" fontWeight={600}>
              Designed for instruction, replication, and critique
            </Typography>
          </Stack>
          <Grid container spacing={4}>
            {featureCards.map((feature) => (
              <Grid key={feature.title} item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    height: '100%',
                    p: 3,
                  }}
                >
                  <Stack spacing={2}>
                    {feature.icon}
                    <Stack spacing={1}>
                      <Typography variant="h6" component="h3" fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              p: { xs: 3, md: 4 },
              backgroundColor: 'background.paper',
            }}
          >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary">
                  Suggested walkthrough
                </Typography>
                <Typography variant="h5" component="h3" fontWeight={600}>
                  A structured tour for seminars and review sessions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  These steps help facilitators keep the session grounded in the
                  underlying datasets while demonstrating the exploratory
                  controls.
                </Typography>
              </Stack>
              <Grid container spacing={3}>
                {workflowSteps.map((step) => (
                  <Grid item xs={12} md={4} key={step.title}>
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.15),
                          color: 'primary.main',
                          fontSize: '1.1rem',
                        }}
                        aria-hidden
                      >
                        {step.step}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'grey.100',
              borderRadius: 3,
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 3, md: 6 }}
              alignItems="center"
            >
              <ImageWrapper height={120}>
                <img
                  src={cleanPath(
                    `${import.meta.env.BASE_URL}strudel-logo-icon.png`
                  )}
                  alt="Strudel Kit logo"
                  loading="lazy"
                />
              </ImageWrapper>
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={600}>
                  Powered by Strudel Kit
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Wine Explorer adopts the Strudel Kit blueprint, pairing React,
                  Material UI, and Plotly to illustrate how scientific datasets
                  can be delivered in an accessible, maintainable presentation
                  layer for academic audiences.
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
