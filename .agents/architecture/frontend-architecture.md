# Frontend Architecture

## Component Architecture

### Component Organization

```
/src
├── components/
│   ├── DatasetSelector.js
│   ├── FilterPanel.js
│   ├── VisualizationArea.js
│   ├── InfoPanel.js
│   └── App.js
├── data/
│   ├── wine-data-manager.js
│   └── csv-loader.js
├── utils/
│   ├── chart-renderer.js
│   └── helpers.js
├── styles/
│   ├── main.css
│   └── components.css
└── index.html
```

### Component Template

```javascript
class ComponentName {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = options;
    this.state = {};
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    // Render component HTML
  }

  bindEvents() {
    // Bind event listeners
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
}
```

## State Management Architecture

### State Structure

```javascript
const appState = {
  currentDataset: 'red', // 'red' | 'white'
  wineData: [], // Array of WineDataPoint objects
  filteredData: [], // Array of filtered WineDataPoint objects
  filters: {}, // Active filter values
  selectedVisualization: 'histogram', // 'histogram' | 'scatterplot'
  selectedFeatures: {
    x: 'alcohol',
    y: 'pH',
  },
};
```

### State Management Patterns

- Single source of truth for application state
- Immutable state updates
- Event-driven state changes
- Component re-rendering on state updates

## Routing Architecture

### Route Organization

This is a single-page application with no routing required.

### Protected Route Pattern

Not applicable for this prototype.

## Frontend Services Layer

### API Client Setup

```javascript
const DataAPI = {
  async loadDataset(datasetType) {
    // Load CSV file for specified dataset type
  },

  async loadAllData() {
    // Load both red and white wine datasets
  },
};
```

### Service Example

```javascript
const WineDataService = {
  filterData(data, filters) {
    // Apply filters to wine data
  },

  getFeatureStats(data, feature) {
    // Calculate statistics for a feature
  },

  getCorrelation(data, featureX, featureY) {
    // Calculate correlation between two features
  },
};
```
