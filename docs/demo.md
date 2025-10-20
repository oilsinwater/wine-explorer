# Wine Explorer Demo Guide

This guide provides instructions for demonstrating the Wine Explorer prototype and key talking points to highlight during presentations.

## Setup Instructions

To run the demo:

```bash
npm install
npm start
```

The application will start on http://localhost:5175

## Key Features to Demonstrate

### 1. Dataset Switching

- **Feature**: Toggle between red and white wine datasets
- **Demo Steps**:
  1. Show the toggle buttons for "Red" and "White"
  2. Switch between datasets and observe the loading spinner
  3. Note the status updates and instance counts
- **Key Points**: Client-side loading with caching and error handling

### 2. Filtering Capabilities

- **Feature**: Filter wine data by physicochemical properties
- **Demo Steps**:
  1. Adjust the "Alcohol Content" range slider
  2. Modify the "pH Level" range slider
  3. Change the "Volatile Acidity" range slider
  4. Observe real-time updates to visualizations and record counts
- **Key Points**: Keyboard-accessible sliders with debounced updates for performance

### 3. Visualizations

- **Feature**: Interactive histograms and scatter plots
- **Demo Steps**:
  1. Select "Histogram" visualization
  2. Choose a feature to visualize (e.g., "alcohol")
  3. Switch to "Scatter Plot"
  4. Select X and Y features (e.g., "alcohol" vs "pH")
- **Key Points**: Powered by Plotly for interactive visualizations

### 4. Dataset Metadata

- **Feature**: Information about data source and characteristics
- **Demo Steps**:
  1. Point to the Dataset Information panel
  2. Show the source (UCI Machine Learning Repository)
  3. Highlight the DOI citation
  4. Note the instance counts (adjusting based on filters)
- **Key Points**: Complete dataset attribution and metadata display

### 5. Responsive Design

- **Feature**: Works across device sizes
- **Demo Steps**:
  1. Resize browser window to show responsive layout
  2. Note how components reflow appropriately
- **Key Points**: Mobile-first approach with MUI Grid system

## Anticipated Q&A Topics

### Q: How does the data loading work?

A: All datasets are loaded client-side from CSV files in the public directory. The application caches loaded datasets for performance and provides retry mechanisms for network errors.

### Q: What's the tech stack?

A: Built with React, TypeScript, Vite, and Material UI. Uses Plotly for visualizations and follows the Strudel Kit architecture patterns.

### Q: How does the filtering work?

A: Client-side filtering using range sliders with immediate visual feedback. The implementation uses debounced updates to maintain performance with large datasets.

### Q: Is the application accessible?

A: Yes, the application follows WCAG AA guidelines with proper ARIA attributes, keyboard navigation, and screen reader support.

### Q: Where does the data come from?

A: The wine datasets are from the UCI Machine Learning Repository under the citation: P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis. (DOI: 10.24432/C56S3T)

## Known Limitations

- Performance may vary with older browsers
- Complex scatterplot visualizations might be slower with large filtered datasets
- No offline capability beyond the initially loaded datasets
