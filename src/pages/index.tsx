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
      eyebrow: 'Dataset curation',
      title: 'Documented provenance with reproducible notes',
      description:
        'Both UCI wine quality datasets include bibliographic references, schema mappings, and step-by-step loading instructions so seminars can cite work with confidence.',
    },
    {
      eyebrow: 'Filtering practice',
      title: 'Cohort shaping through accessible controls',
      description:
        'Range inputs are keyboard navigable and screen-reader annotated, inviting discussion about inclusive filter design while highlighting physicochemical trade-offs.',
    },
    {
      eyebrow: 'Visual reading',
      title: 'Histograms and scatter plots for comparison',
      description:
        'Parallel views allow facilitators to contrast distributions and correlations in real time, reinforcing interpretive skills with quantitative footing.',
    },
    {
      eyebrow: 'Accessibility',
      title: 'High-contrast toggles with narrated feedback',
      description:
        'Help, narration, and high-contrast controls sit within the visualization frame so accessibility conversations can unfold alongside the data story.',
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
          backgroundColor: 'transparent',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
            <Grid item xs={12} md={7}>
              <Stack spacing={3} sx={{ maxWidth: 640 }}>
                <Typography variant="overline" color="text.secondary">
                  Wine Explorer
                </Typography>
                <Typography component="h1" variant="h1" sx={{ maxWidth: 620 }}>
                  A reference surface for discussing wine chemistry in academic
                  settings
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  This single-page application accompanies the Wine Explorer
                  PRD. It offers a reserved environment for unpacking the UCI
                  red and white wine quality datasets, encouraging structured
                  critique of filtering choices, visualization literacy, and
                  accessibility practices.
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
                    href="https://strudel.science/docs"
                    target="_blank"
                    rel="noreferrer"
                    variant="text"
                    size="large"
                  >
                    View methodology notes
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
                    Reference dossier
                  </Typography>
                  <Stack spacing={1.5}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Dataset citation
                      </Typography>
                      <Typography variant="body2">
                        Cortez et&nbsp;al., 2009 — UCI Wine Quality (DOI:
                        10.24432/C56S3T)
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Variables
                      </Typography>
                      <Typography variant="body2">
                        11 physicochemical measurements with quality scores,
                        covering red and white wine styles
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Classroom use
                      </Typography>
                      <Typography variant="body2">
                        Support critiques of data storytelling, reproducibility,
                        and accessible interface construction.
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
              Interface emphasis
            </Typography>
            <Typography variant="h3" component="h2">
              Built for instruction, replication, and critique
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 720 }}
            >
              Each section foregrounds process over polish so faculty and
              students can interrogate design decisions while remaining close to
              the underlying datasets.
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
