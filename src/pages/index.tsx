import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
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
  const featureSections = [
    {
      eyebrow: 'Dataset provenance',
      title: 'Direct from the Portuguese Vinho Verde study',
      description:
        'Explore the red and white wine quality datasets from the original research by Cortez et al. (2009) on "Modeling wine preferences by data mining from physicochemical properties", including all 11 physicochemical measurements with quality scores.',
    },
    {
      eyebrow: 'Academic rigor',
      title: 'Reproduce the regression-based quality prediction',
      description:
        'Filter and analyze the same physicochemical variables used in the original study, allowing students to reproduce and critique the methodology used to predict wine quality ratings.',
    },
    {
      eyebrow: 'Visual exploration',
      title: 'Histograms and scatter plots for comparison',
      description:
        'Parallel views allow facilitators to contrast distributions and correlations in real time, reinforcing interpretive skills with the quantitative foundation of the original research.',
    },
    {
      eyebrow: 'Accessibility',
      title: 'High-contrast toggles with narrated feedback',
      description:
        'Help, narration, and high-contrast controls sit within the visualization frame so accessibility conversations can unfold alongside the data story from the original study.',
    },
  ];

  const workflowSteps = [
    {
      step: '1',
      title: 'Select wine type',
      description:
        'Choose between the red and white Vinho Verde datasets from the Cortez et al. study to explore the physicochemical properties examined in the original research.',
    },
    {
      step: '2',
      title: 'Filter physicochemical ranges',
      description:
        'Adjust parameters like fixed acidity, volatile acidity, citric acid, and alcohol content to investigate how these variables correlate with quality ratings in the original study.',
    },
    {
      step: '3',
      title: 'Analyze quality predictions',
      description:
        'Examine how the 11 physicochemical measurements relate to quality scores to understand the modeling approach used in the original research.',
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: 'transparent',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
            <Grid item xs={12} md={7}>
              <Stack spacing={3} sx={{ maxWidth: 640 }}>
                <Typography component="h1" variant="h1" sx={{ maxWidth: 620 }}>
                  Interactive lab for the Vinho Verde wine dataset
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  This interface accompanies the original research by Cortez et
                  al. (2009) on "Modeling wine preferences by data mining from
                  physicochemical properties". Students can explore the red and
                  white wine quality datasets to understand the methodology and
                  reproduce analyses from the study.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
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
                    href="https://repositorium.uminho.pt/server/api/core/bitstreams/f3dd2aa2-9eda-4eba-b50e-6306a0bd0c66/content"
                    target="_blank"
                    rel="noreferrer"
                    variant="text"
                    size="large"
                  >
                    Read original paper
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
                  backgroundColor: (theme) => theme.palette.background.paper,
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Research references
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Original study
                      </Typography>
                      <Typography variant="body2">
                        Cortez, P., Cerdeira, A., Almeida, F., Matos, T., &
                        Reis, J. (2009). Modeling wine preferences by data
                        mining from physicochemical properties.
                        <i>Food Research International</i>, 42(5), 640-647.
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Dataset sources
                      </Typography>
                      <Typography variant="body2">
                        <a
                          href="https://archive.ics.uci.edu/dataset/186/wine+quality"
                          target="_blank"
                          rel="noreferrer"
                        >
                          UCI Machine Learning Repository
                        </a>
                        <br />
                        <a
                          href="https://github.com/uci-ml-repo/ucimlrepo"
                          target="_blank"
                          rel="noreferrer"
                        >
                          UCI ML Repo GitHub
                        </a>
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Sample sizes
                      </Typography>
                      <Typography variant="body2">
                        Red wine: 1,599 samples | White wine: 4,898 samples
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Physicochemical variables
                      </Typography>
                      <Typography variant="body2">
                        Fixed acidity, volatile acidity, citric acid, residual
                        sugar, chlorides, free sulfur dioxide, total sulfur
                        dioxide, density, pH, sulphates, alcohol
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Modeling focus
                      </Typography>
                      <Typography variant="body2">
                        Regression-based quality prediction using
                        physicochemical properties
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
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
              Academic focus
            </Typography>
            <Typography variant="h3" component="h2">
              Built for reproducing and critiquing the original research
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 720 }}
            >
              Each section foregrounds the methodology from Cortez et al. (2009)
              so faculty and students can reproduce analyses, validate findings,
              and critique the modeling approach using the same physicochemical
              datasets.
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, md: 4 },
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            {featureSections.map((feature) => (
              <Box
                key={feature.title}
                sx={{
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  pt: { xs: 2.5, md: 3 },
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {feature.eyebrow}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary">
                  Suggested walkthrough
                </Typography>
                <Typography variant="h5" component="h3">
                  A seminar-friendly progression
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Use the following flow to keep workshop participants oriented
                  while demonstrating the interface.
                </Typography>
              </Stack>
              <Stack
                spacing={2.5}
                divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}
              >
                {workflowSteps.map((step) => (
                  <Stack
                    key={step.title}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1.5, sm: 3 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ minWidth: 72 }}
                    >
                      Step&nbsp;{step.step}
                    </Typography>
                    <Stack spacing={0.75}>
                      <Typography variant="subtitle1">{step.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              p: { xs: 3, md: 4 },
              backgroundColor: (theme) => theme.palette.grey[50],
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 3, md: 6 }}
              alignItems="center"
            >
              <ImageWrapper height={96}>
                <img
                  src={cleanPath(
                    `${import.meta.env.BASE_URL}strudel-logo-icon.png`
                  )}
                  alt="Strudel Kit logo"
                  loading="lazy"
                />
              </ImageWrapper>
              <Stack spacing={1}>
                <Typography variant="h5">Powered by Strudel Kit</Typography>
                <Typography variant="body1" color="text.secondary">
                  Wine Explorer adopts the Strudel Kit blueprint, pairing React,
                  Material UI, and Plotly to demonstrate how to surface
                  scientifically grounded datasets with clear, accessible visual
                  framing.
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
