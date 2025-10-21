# Research-Aligned Single Page Experience - Brownfield Enhancement

## Epic Goal

Deliver a single-page Wine Explorer experience whose above-the-fold narrative and below-the-fold interactive workspace both reference and contextualize the original UCI “Modeling wine preferences by data mining from physicochemical properties” study, preserving academic tone while keeping existing functionality intact.

## Epic Description

**Existing System Context**

- Current relevant functionality: Landing page introduces the project with academic copy while `/wine-explorer` hosts dataset selection, filtering, and visualization controls.
- Technology stack: React 18, TypeScript, Vite, Material UI, Plotly, TanStack Router.
- Integration points: `src/pages/index.tsx`, `src/pages/wine-explorer.tsx`, shared context providers (`AccessibilityProvider`, `AppProvider`, `WineDataContext`), navigation to `/wine-explorer`.

**Enhancement Details**

- What's being added/changed: Merge the `/wine-explorer` workspace into the home page, update landing content and reference sections to cite the Cortez et al. (2009) research, and ensure research metadata is surfaced alongside the interactive controls.
- How it integrates: Refactor routing to keep a single `/` route that renders the existing landing sections followed by the workspace modules; update copy blocks and reference panels within the same file; maintain providers and navigation behavior.
- Success criteria: Home page copy cites primary sources, provides dataset/sample metadata, and the interactive workspace loads seamlessly below the fold without functional regressions.

## Stories

1. **3.5 Research-aligned landing copy** – Refresh hero, reference dossier, and supporting sections to cite Cortez et al. (2009) and link to the UCI resources.
2. **3.6 Single-page workspace integration** – Embed the dataset selector, filter panel, info panel, and visualization area within the home page while preserving state management.
3. **3.7 Research context surfacing within workspace** – Add contextual annotations around the controls/plots (e.g., dataset sample sizes, quality scale reminders) referencing the paper, ensuring accessibility messaging remains intact.

## Compatibility Requirements

- [ ] Existing APIs remain unchanged
- [ ] Database schema changes are backward compatible (no schema changes expected)
- [ ] UI changes follow the updated academic design language
- [ ] Performance impact is minimal (lazy loading or memoization considered if bundle size grows)

## Risk Mitigation

- **Primary Risk:** Consolidating routes could break context providers or increase initial load time.
- **Mitigation:** Reuse existing providers in `App.tsx`, smoke test data loading, and profile bundle impact; consider code splitting if bundle size warning worsens.
- **Rollback Plan:** Revert `src/pages/index.tsx`, `src/pages/wine-explorer.tsx`, and routing changes to previous commits to restore two-page structure.

## Definition of Done

- [ ] All related stories completed with acceptance criteria met
- [ ] Interactive workspace functions on the home page with responsive layout
- [ ] Landing narrative accurately cites original research and datasets
- [ ] Regression testing confirms filters, charts, and accessibility controls still work
- [ ] Documentation (README or landing copy) reflects single-page experience
- [ ] No new accessibility or performance regressions introduced

## Validation Checklist

**Scope Validation**

- [ ] Epic can be delivered in three brownfield stories
- [ ] No architectural overhaul required; leverages existing React providers and components
- [ ] Enhancement follows established design patterns from recent refresh
- [ ] Integration complexity manageable within existing code structure

**Risk Assessment**

- [ ] Risk to existing system is low-to-moderate and documented above
- [ ] Rollback strategy identified
- [ ] Testing plan covers both landing and workspace flows
- [ ] Team familiar with current component structure

**Completeness Check**

- [ ] Epic goal and success criteria are measurable
- [ ] Stories are scoped and sequenced logically
- [ ] External dependencies (links, citations) identified
- [ ] Compatibility requirements captured

## Story Manager Handoff

"Please develop detailed user stories for this brownfield epic. Key considerations:

- This enhancement adapts the existing React + Material UI single-page app.
- Integration touches the home page route and the current `/wine-explorer` components.
- Follow the recently established academic design language and typography system.
- Ensure citations and research metadata align with Cortez et al. (2009) and the UCI dataset documentation.
- Each story must verify that existing filtering, visualization, and accessibility features remain operational after consolidation."
