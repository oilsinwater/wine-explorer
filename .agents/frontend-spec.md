# Front-End Specification: Wine Explorer

## 1. USER FLOWS

### Flow 1: Data Practitioner Exploring Datasets

```
START → Access Wine Explorer
  ├─→ View Default Dataset (Red Wine)
  ├─→ Switch to Alternative Dataset (White Wine)
  │   ├─→ System Loads White Wine Dataset
  │   ├─→ Update Visualizations
  │   └─→ Update Metadata Display
  ├─→ Begin Data Exploration
  │   ├─→ View Histogram for Feature
  │   ├─→ Identify Patterns/Outliers
  │   ├─→ Switch to Scatterplot View
  │   ├─→ View Feature Relationships
  │   └─→ Interpret Visualization
  └─→ Apply Filters
      ├─→ Adjust Range Sliders
      ├─→ System Applies Filter
      ├─→ Update Visualizations
      └─→ Update Metadata Counts → END

```

### Flow 2: Educator/Student Learning with Data

```
START → Access Wine Explorer
  ├─→ Learn About Dataset (Information Panel)
  ├─→ View All Wines (Default View)
  ├─→ Filter to Specific Characteristics
  │   └─→ Compare Alcohol Content Ranges
  ├─→ Create Visualization
  │   ├─→ View Histogram
  │   │   └─→ Compare Distributions
  │   └─→ Switch to Scatterplot
  │       └─→ View pH vs Alcohol Relationships
  └─→ Reset Exploration
      ├─→ Clear Filters
      └─→ Return to Full Dataset → END
```

### Flow 3: Accessibility User with Screen Reader

```
START → Skip to Main Content
  ├─→ Navigate by Headings
  ├─→ Interact with Dataset Toggle
  │   └─→ Hear Dataset Change Announcement
  ├─→ Navigate Filter Controls
  │   └─→ Hear Filter Announcements
  ├─→ Access Visualization Data
  │   └─→ Hear Chart Alternative Text
  └─→ Navigate to Information Panel
      └─→ Hear Dataset Metadata → END
```

## 2. WIREFRAMES

### Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo] Wine Explorer                                [Help] [Info]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────┐ ┌─────────────────────────────────────────────┐   │
│ │  DATASET    │ │  EXPLORATION VIEW                           │   │
│ │             │ │                                             │   │
│ │ [Red] White │ │  Dataset Information:                       │   │
│ │             │ │  Source: UCI ML Repository                  │   │
│ │             │ │  DOI: 10.24432/C56S3T                       │   │
│ │             │ │  Instances: 1,599                           │   │
│ │             │ │                                             │   │
│ │  FILTERS    │ │  [Alcohol Content] [pH Level]               │   │
│ │             │ │  [=====|======] 9.0 - 14.0                  │   │
│ │             │ │  [=|========] 2.7 - 4.0                     │   │
│ │             │ │                                             │   │
│ │ [Clear All] │ │  ┌────────────────────────────────────────┐  │   │
│ │             │ │  │            VISUALIZATION               │  │   │
│ │             │ │  │                                        │  │   │
│ │             │ │  │         |^                             │  │   │
│ │             │ │  │         | |        *                   │  │   │
│ │             │ │  │   Count | |      *   *                 │  │   │
│ │             │ │  │         | |    *     *                 │  │   │
│ │             │ │  │         | |  *       *                 │  │   │
│ │             │ │  │         | |*         *                │  │   │
│ │             │ │  │         |________________________>     │  │   │
│ │             │ │  │         9.0     Alcohol Content   14.0 │  │   │
│ │             │ │  └────────────────────────────────────────┘  │   │
│ │             │ │                                             │   │
│ │             │ │  [Histogram] [Scatterplot]                  │   │
│ └─────────────┘ └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Visualization View (Scatterplot)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo] Wine Explorer                                [Help] [Info]   │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────────────────────────┐   │
│ │  DATASET    │ │  EXPLORATION VIEW                           │   │
│ │             │ │                                             │   │
│ │  Red [White]│ │  Dataset Information:                       │   │
│ │             │ │  Source: UCI ML Repository                  │   │
│ │             │ │  Instances: 4,898 (Filtered: 2,345)         │   │
│ │  FILTERS    │ │                                             │   │
│ │             │ │  [Alcohol Content] [pH Level]               │   │
│ │             │ │  [=====|==    ] 10.0 - 12.0                 │   │
│ │             │ │  [=|========] 2.7 - 3.8                     │   │
│ │ [Clear All] │ │                                             │   │
│ │             │ │  ┌────────────────────────────────────────┐  │   │
│ │             │ │  │            VISUALIZATION               │  │   │
│ │             │ │  │                                        │  │   │
│ │             │ │  │   pH  |^                               │  │   │
│ │             │ │  │   Lvl | |             *    *            │  │   │
│ │             │ │  │       | |          *   *               │  │   │
│ │             │ │  │       | |        *     *               │  │   │
│ │             │ │  │       | |      *       *               │  │   │
│ │             │ │  │       | |    *         *               │  │   │
│ │             │ │  │       | |  *           * *             │  │   │
│ │             │ │  │       | |*             *               │  │   │
│ │             │ │  │       |________________________>       │  │   │
│ │             │ │  │       10.0    Alcohol Content     12.0 │  │   │
│ │             │ │  └────────────────────────────────────────┘  │   │
│ │             │ │                                             │   │
│ │             │ │  [Histogram] [Scatterplot]                  │   │
│ └─────────────┘ └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1023px)

```
┌─────────────────────────────────────────┐
│ ☰ Wine Explorer           [Help][Info]  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ▼ DATASET & FILTERS (Collapsible)   │ │
│ ├─────────────────────────────────────┤ │
│ │ [Red] White                        │ │
│ │                                    │ │
│ │ [Alcohol Content] [pH Level]       │ │
│ │ [=====|======] 9.0 - 14.0          │ │
│ │ [=|========] 2.7 - 4.0             │ │
│ │                                    │ │
│ │ [Clear All]                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     [Histogram] [Scatterplot]       │ │
│ │                                     │ │
│ │     Visualization Area              │ │
│ │     (Scrollable)                    │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌─────────────────┐
│ ☰ Wine Explorer │
├─────────────────┤
│ [Red] [White]   │
├─────────────────┤
│ [▼ Filters (2)] │
├─────────────────┤
│ Tabs:           │
│ [Histogram] [Scatter] │
├─────────────────┤
│                 │
│  Visualization  │
│  (Full Width)   │
│                 │
│  Histogram or   │
│  Scatterplot    │
│                 │
└─────────────────┘
```

## 3. INTERACTION SPECIFICATIONS

### Dataset Toggle Interactions

```
State Flow:
Initial → Red Wine Dataset → User Clicks White → Update URL → Load White Dataset → Update UI

Visual Feedback:
- Toggle: Strudel primary color for active dataset
- Transition: 200ms ease-in-out
- Focus: 2px offset outline
- Hover: 10% darker background

Announcements:
"Switching to white wine dataset. Loading 4,898 instances."
```

### Filter Interactions

```
Filter Change Sequence:
1. User interaction with slider
2. Update local state immediately
3. Show loading indicator on visualizations
4. Debounce 300ms
5. Update URL params
6. Recalculate filtered data
7. Announce result count
8. Fade in new visualization (200ms)

Slider Behavior:
- Range: Min to Max values for feature
- Handles: Draggable endpoints
- Fill: Highlight between handles
- Labels: Min/Max/current values
```

### Visualization Interactions

```
Hover States:
- Histogram Bars: Highlight on hover with tooltip
- Scatterplot Points: Scale 1.2x on hover with tooltip
- Tooltip: Show after 100ms
- Content: Feature values, data point details

Tooltip Positioning:
- Default: Top-right of cursor
- Edge detection: Flip to opposite side
- Mobile: Fixed bottom sheet
```

### Loading States

```
Skeleton Patterns:
┌─────────────────────┐
│ ░░░░░░░░░░░░░░░░░░ │ <- Animated gradient
│ ░░░░ ░░░░░ ░░░░░░░ │    shimmer effect
│ ░░░░░░░░░░░░░░░░░░ │
└─────────────────────┘

Timing:
- Show after 100ms delay
- Minimum display: 300ms
- Fade out: 200ms
```

## 4. VISUAL DESIGN GUIDELINES

### Color System

```css
/* Strudel Kit Core Palette */
--strudel-primary: #2e86ab; /* Blue */
--strudel-secondary: #a23b72; /* Purple */
--strudel-tertiary: #f18f01; /* Orange */

/* Wine Dataset Colors */
--wine-red: #a23b72; /* Red Wine */
--wine-white: #f18f01; /* White Wine */

/* UI Colors */
--background: #ffffff;
--surface: #f8f9fa;
--border: #e5e7eb;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-muted: #9ca3af;

/* State Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography

```css
/* Font Stack */
--font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Type Scale */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System

```css
/* 8px Base Grid */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
```

### Component Styling

```css
/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Buttons */
.button-primary {
  background: var(--strudel-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-weight: var(--font-medium);
  transition: all 200ms ease-in-out;
}

/* Range Sliders */
.slider {
  width: 100%;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--strudel-primary);
  cursor: pointer;
}
```

## 5. COMPONENT SPECIFICATIONS

### DatasetToggle Component

```typescript
interface DatasetToggleProps {
  currentDataset: 'red' | 'white';
  onDatasetChange: (dataset: 'red' | 'white') => void;
  className?: string;
}

interface DatasetToggleState {
  isTransitioning: boolean;
}

// Behavior Specifications:
// - Shows active dataset with color coding
// - Announces dataset changes to screen readers
// - Smooth transition between datasets
// - Keyboard accessible (Enter/Space to toggle)
```

### FilterPanel Component

```typescript
interface FilterPanelProps {
  filters: WineFilter[];
  onFilterChange: (filter: WineFilter) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

interface WineFilter {
  feature: string;
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
}

// Features:
// - Range sliders for each feature
// - Clear all filters button
// - Active filter count badge
// - Collapsible on mobile
// - Keyboard navigation
```

### Histogram Component

```typescript
interface HistogramProps {
  data: WineDataPoint[];
  feature: string;
  bins: number;
  width?: number;
  height?: number;
}

interface HistogramState {
  hoveredBin: number | null;
  tooltipPosition: { x: number; y: number };
}

// Visual Specifications:
// - Bars representing frequency distribution
// - X-axis: Feature values
// - Y-axis: Count or density
// - Hover shows exact count/range
// - Responsive sizing
```

### ScatterPlot Component

```typescript
interface ScatterPlotProps {
  data: WineDataPoint[];
  xFeature: string;
  yFeature: string;
  width?: number;
  height?: number;
}

interface ScatterPlotState {
  hoveredPoint: WineDataPoint | null;
  tooltipPosition: { x: number; y: number };
}

// Interaction Behaviors:
// - Hover: Scale point 1.2x, show tooltip
// - Keyboard: Arrow keys navigate points
// - Touch: Tap to show/hide tooltip
```

### InfoPanel Component

```typescript
interface InfoPanelProps {
  datasetInfo: DatasetInfo;
  instanceCount: number;
  filteredCount?: number;
}

interface DatasetInfo {
  source: string;
  doi: string;
  totalInstances: number;
}

// Features:
// - Dataset metadata display
// - Instance count (filtered vs total)
// - Source citation information
// - Responsive layout
```

## 6. RESPONSIVE DESIGN

### Breakpoint System

```css
/* Breakpoints */
--mobile: 0px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;

/* Container Widths */
--container-mobile: 100%;
--container-tablet: 750px;
--container-desktop: 1000px;
--container-wide: 1200px;
```

### Mobile Adaptations

```css
/* Filter Panel */
@media (max-width: 767px) {
  .filter-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid var(--border);
    max-height: 50vh;
    overflow-y: auto;
    transform: translateY(100%);
    transition: transform 300ms ease-out;
  }

  .filter-panel.open {
    transform: translateY(0);
  }
}

/* Visualization */
@media (max-width: 767px) {
  .visualization-container {
    height: 300px; /* Fixed height */
    margin: var(--space-4) calc(var(--space-4) * -1);
  }

  .visualization-controls {
    flex-direction: column;
    gap: var(--space-2);
  }
}
```

### Touch Interactions

```typescript
// Touch-specific behaviors
const touchHandlers = {
  onTouchStart: (e: TouchEvent) => {
    // Store initial touch point
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  },

  onTouchMove: (e: TouchEvent) => {
    // Calculate delta for pan/swipe
    const delta = {
      x: e.touches[0].clientX - touchStart.x,
      y: e.touches[0].clientY - touchStart.y,
    };

    // Horizontal swipe to change visualization type
    if (Math.abs(delta.x) > 50 && Math.abs(delta.y) < 20) {
      switchVisualization(delta.x > 0 ? 'prev' : 'next');
    }
  },

  onTouchEnd: (e: TouchEvent) => {
    // Tap to show tooltip
    if (touchDuration < 200) {
      showTooltipAtPoint(e.changedTouches[0]);
    }
  },
};
```

## 7. ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance

#### Keyboard Navigation Map

```
Tab Order:
1. Skip to main content
2. Help button
3. Dataset toggle
4. Filter panel
   a. Feature sliders
   b. Clear filters button
5. Visualization controls
   a. Histogram button
   b. Scatterplot button
6. Main visualization area
7. Information panel
```

#### Screen Reader Announcements

```typescript
// Dataset changes
announce('Switching to white wine dataset. 4,898 instances loaded.');

// Filter changes
announce('2 filters active. Showing 2,345 of 4,898 instances.');

// Visualization updates
announce('Histogram updated. Alcohol content distribution for 2,345 wines.');

// Data loading
announce('Loading wine data...');
announce('Data loaded. 1,599 red wines displayed.');

// Errors
announce('Error: Unable to load data. Please refresh the page.');
```

#### ARIA Patterns

```html
<!-- Dataset Toggle -->
<section role="region" aria-label="Dataset selection" aria-live="polite">
  <h2 id="dataset-heading">Dataset</h2>
  <button
    role="switch"
    aria-checked="true"
    aria-labelledby="red-wine-label"
    aria-describedby="dataset-status"
  >
    Red Wine
  </button>
  <button role="switch" aria-checked="false" aria-labelledby="white-wine-label">
    White Wine
  </button>
  <div id="dataset-status" role="status" aria-live="polite">
    Red wine dataset active. 1,599 instances.
  </div>
</section>

<!-- Filter Panel -->
<div role="region" aria-label="Data filters" aria-live="polite">
  <h2>Filters</h2>
  <div role="group" aria-labelledby="alcohol-label">
    <label id="alcohol-label">Alcohol Content</label>
    <input
      type="range"
      min="8.0"
      max="14.0"
      value="8.0"
      aria-describedby="alcohol-status"
    />
    <span id="alcohol-status">8.0 to 14.0</span>
  </div>
</div>

<!-- Visualization -->
<figure role="img" aria-label="Histogram of alcohol content">
  <div id="chart-description" class="sr-only">
    This histogram shows the distribution of alcohol content for 1,599 red
    wines. Values range from 8.4 to 14.9 percent alcohol by volume.
  </div>
</figure>
```

#### Focus Management

```typescript
// Modal focus trap
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

#### Color Contrast Requirements

```css
/* Minimum contrast ratios */
/* Normal text: 4.5:1 */
/* Large text: 3:1 */
/* UI components: 3:1 */

/* Example validations */
--text-on-primary: #ffffff; /* 7.2:1 on primary blue */
--text-on-surface: #1f2937; /* 15.8:1 on surface */
--border-color: #d1d5db; /* 3.1:1 on white */
```

### Assistive Technology Support

```typescript
// Chart alternative descriptions
const generateChartDescription = (data: WineDataPoint[], feature: string) => {
  const summary = calculateSummaryStats(data);

  return `
    This histogram shows ${data.length} wines.
    ${feature} ranges from ${summary.min} to ${summary.max}.
    
    Distribution:
    - Lowest quartile: ${summary.q1}
    - Median: ${summary.median}
    - Highest quartile: ${summary.q3}
    
    Most common range: ${summary.modeRange}
  `;
};
```

### Error Handling & Recovery

```typescript
// Graceful degradation
const ErrorBoundary: React.FC = ({ children }) => {
  if (error) {
    return (
      <div role="alert" className="error-state">
        <h2>Unable to display visualization</h2>
        <p>The data is still available in table format.</p>
        <button onClick={retry}>Try Again</button>
        <InfoPanel datasetInfo={datasetInfo} instanceCount={instanceCount} />
      </div>
    );
  }
  return children;
};
```

This comprehensive specification provides the detailed guidance needed to build an accessible, responsive, and user-friendly Wine Explorer that showcases Strudel Kit's capabilities while serving the needs of data practitioners and educators.
