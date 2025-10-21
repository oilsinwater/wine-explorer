# Wine Explorer × Cortez et al. (2009) Alignment Brief

## 1. Purpose

- Ensure the Wine Explorer experience faithfully communicates the findings from _Modeling wine preferences by data mining from physicochemical properties_ (Cortez et al., 2009).
- Translate research results into product decisions so interactive storytelling covers the minimum viable insights for workshops and certification simulations.

## 2. Source Research Highlights

- **Dataset** – 1,599 red and 4,898 white Vinho Verde samples collected 2004‑2007; each graded 0–10 by blind sensory panels (median of ≥3 tasters). Physicochemical inputs span 11 routine lab tests plus the quality score (`original-paper.txt`, lines 216‑314, 648‑706).
- **Modeling goal** – Predict sensory quality directly (regression) to respect grade ordering; recap results via Mean Absolute Deviation and Regression Error Characteristic tolerances (`original-paper.txt`, lines 286‑460).
- **Techniques compared** – Multiple Regression, Neural Network, Support Vector Machine. Simultaneous model + feature selection performed with sensitivity analysis to prune inputs while tuning hyperparameters (`original-paper.txt`, lines 460‑820, 900‑990).
- **Key outcomes** – SVM leads accuracy for both wines (T=0.5: 62.4 % red / 64.6 % white; T=1.0: 89.0 % red / 86.8 % white) and yields actionable feature importance for sulphates, alcohol, residual sugar, citric acid, and volatile acidity (`original-paper.txt`, lines 900‑1040).
- **Implications** – Position outputs for certification support (flag when expert ratings diverge from model) and targeted marketing cohorts once feature drivers are understood (`original-paper.txt`, lines 1010‑1180).

## 3. Current Product Coverage

| Research Need                                                               | Experience Touchpoint                                                                                                                                          | Coverage Assessment                                                                      |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Communicate dataset composition (red vs white counts, DOI, 11 variables)    | Dataset selector, Info Panel (`src/components/DatasetSelector.tsx`, `src/components/InfoPanel.tsx`)                                                            | ✅ Values, counts, and metadata surfaced with accessible announcements.                  |
| Allow exploration of physicochemical features                               | Filter Panel (alcohol, pH, volatile acidity), visualization controls (`src/components/FilterPanel.tsx`, `src/components/visualizations/VisualizationArea.tsx`) | ◑ Supports 3 of 11 features; axes configurable but lacks guided storytelling.            |
| Explain modeling objective, evaluation metrics, and comparative performance | Homepage + UI chrome (`src/pages/index.tsx`)                                                                                                                   | ❌ No mention of regression framing, tolerance thresholds, or SVM advantage.             |
| Share feature-importance learnings (e.g., sulphates dominance)              | Any UI surface                                                                                                                                                 | ❌ Not represented; no qualitative or quantitative cues.                                 |
| Tie experience to certification and marketing decision-support scenarios    | Homepage narrative (`src/pages/index.tsx`)                                                                                                                     | ◑ Mentions instruction/critique but omits certification workflow or marketing use cases. |
| Reveal preprocessing/anomaly handling & summary stats mirroring Table 1     | Info Panel / documentation                                                                                                                                     | ❌ Only counts surfaced; no means, ranges, or anomaly reporting.                         |

## 4. Identified Gaps

1. **Narrative disconnect** – Users lack context on why the model matters, how quality scores behave, or what tolerance bands mean.
2. **Feature emphasis mismatch** – Critical drivers (sulphates, residual sugar, citric acid, total sulfur dioxide) are absent from controls or callouts, obscuring paper insights.
3. **Evaluation transparency** – No REC/MAD analogue or visualization to explain accuracy numbers or tolerances.
4. **Decision-support framing** – Certification retaste triggers and marketing cohort stories are missing, weakening the link to the research’s proposed applications.
5. **Data hygiene visibility** – Dataset statistics and anomaly logging (tracked in `wineDataManager`) are not surfaced, leaving provenance gaps.
6. **Asset sprawl** – Research findings reside in ad-hoc notes; teams lack a canonical reference to align design and build decisions.

## 5. Recommended Actions (Priority order)

1. **Research Summary Module** – Add a structured panel (homepage hero or modal) that states dataset scope, regression goal, tolerance definitions (T=0.25/0.5/1.0), and headline SVM vs MR/NN accuracy figures.
2. **Feature Importance Visualization** – Introduce a dedicated graphic (bar chart or annotated list) showing sulphates/alcohol/residual sugar/citric acid/volatile acidity rankings per wine type, sourced from the paper’s sensitivity analysis.
3. **Expanded Filtering & Presets** – Expose additional sliders or presets for the high-impact features and provide guided scenarios (e.g., “High sulphates cohort”) to echo the study’s insights.
4. **REC-inspired Feedback** – Render a tolerance vs accuracy micro-chart or table to translate REC/MAD concepts, helping facilitators discuss model performance trade-offs.
5. **Decision-Support Storytelling** – Extend copy/tooltips to describe certification checks (e.g., “Retaste if model vs panel deviates by ≥1 grade”) and marketing exploration pathways.
6. **Dataset Health Snapshot** – Surface summary statistics and anomaly counts (leveraging `wineDataManager` metrics) so users can validate data integrity.
7. **Documentation Cadence** – Link this brief from `README.md` (Documentation section) and keep it updated as UX changes land.

## 6. Next Steps

1. Socialize this brief with design + engineering to confirm scope and sequencing.
2. Translate prioritized actions into stories (storyboard, acceptance criteria, QA hooks).
3. Prototype narrative + visualization additions; validate with facilitators that minimum insights from the paper are now discoverable.
4. Schedule a regression review once implementation ships to ensure alignment with the source research remains intact.
