# Project Brief

A focused microsite should bridge the gap between scattered demos and research notebooks by offering an integrated, fast, and explainable way to explore both red and white UCI Wine Quality datasets with filters, multi-view EDA, and "what‑if" prediction in one place.
This brief consolidates dataset specifics and proven UI patterns from existing dashboards and lightweight data apps to define scope, features, and constraints.

## Problem statement
Most public examples are either prediction-only widgets, narrow single-dataset dashboards, or course notebooks, forcing users to hop between tools for filtering, visualization, and modeling across red and white wines.
A microsite is needed to unify dataset switching, rich EDA, interpretable baselines, and "what‑if" inputs for ordered quality scores, with responsive performance on small tabular data.

## Target users
Based on our user research, we've identified the following primary and secondary user groups:

- **Primary**: Data scientists and ML engineers seeking quick, reproducible EDA and baseline models over 11 physicochemical features with ordered, imbalanced quality targets.
- **Primary**: Educators and students needing transparent, interactive charts and downloadable assets for teaching classification/regression and class imbalance.
- **Primary**: Oenologists/QA practitioners exploring relationships (e.g., alcohol, acidity, sulphates, pH) and inspecting rare high/low quality cases for process insights.
- **Secondary**: Business/marketing analysts who need clear summaries and visual narratives drawn from small, clean datasets for stakeholder communication.
- **Secondary**: Enthusiasts/hobbyists experimenting with sliders to see how hypothetical physicochemical changes affect predicted quality across red vs. white.

## Core features
Our analysis of competitive tools and user personas has identified the following essential and enhanced features:

### Must‑have
- Dataset switcher for red and white with synced schemas and metadata, reflecting $$n=1{,}599$$ red and $$n=4{,}898$$ white instances.
- Faceted filters and range sliders for all 11 features, with visible "active filters" and result counts for rapid subsetting.
- EDA visuals: histograms/box plots, scatterplots with tooltips and trend options, correlation heatmap, and class distribution bars.
- "What‑if" prediction form with numeric inputs for physicochemical variables and immediate quality estimate to support hypothesis testing.
- Baseline models (e.g., linear/tree/gradient boosting) with metrics appropriate to ordered targets and imbalanced classes.
- Exports: filtered CSV and PNG/SVG charts; include dataset citation and license info for downstream use.

### Nice‑to-have
- Linked, multi‑view dashboards with brushing and highlighting across plots for richer pattern discovery.
- Model explainability (e.g., permutation importance) and partial dependence-like "feature effect" overlays.
- Save/share "view states" (filters + charts), plus lightweight API endpoints for programmatic retrieval of filtered data.
- Red‑vs‑white comparison layouts with mirrored scales and side‑by‑side feature distributions and correlations.
- Guided walkthroughs or lesson-mode narratives for classroom use, with downloadable notebooks.

## Success metrics
To measure the effectiveness of our solution, we'll track these key performance indicators:

- **Adoption and engagement**: Percentage of sessions interacting with filters, switching datasets, or using the "what‑if" panel; median session duration exceeding a baseline expected for exploratory dashboards.
- **Exploratory depth**: Average number of distinct charts viewed per session and frequency of brushing/linked interactions.
- **Performance**: Time-to-first-chart and filter response times within sub-second ranges given dataset sizes of $$1{,}599$$ and $$4{,}898$$ rows.
- **Learning and reuse**: Count of CSV/chart downloads and saved view states, plus referrals from course materials and research pages.
- **Modeling utility**: Proportion of sessions running baselines and inspecting model metrics/explanations, indicating value beyond static EDA.

## Technical constraints
Based on our technical analysis and UI pattern research, we've established these implementation guidelines:

- **Browsers**: Support modern evergreen browsers (Chromium-based, Firefox, Safari) with responsive layouts and accessible tooltips/legends typical of web dashboards.
- **Performance**: Keep all interactions client‑side where feasible; the combined data volume (<10 MB) fits comfortably in memory, enabling instant filters and redraws.
- **Data and citation**: Bundle or fetch official CSVs and show source, DOI, and license on every page; maintain parity with UCI variable names.
- **Visualization stack**: Favor Vega/Altair- or Tableau-like coordinated views and Streamlit-style controls for quick iteration and deployment simplicity.
- **Modeling**: Run lightweight inference in-browser for "what‑if" or provide a minimal stateless API; ensure determinism and fast cold starts for baseline models.
- **Accessibility**: Implement WCAG AA compliance with keyboard navigation, screen reader support, and colorblind-safe palettes based on our accessibility research.