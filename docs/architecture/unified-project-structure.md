# Unified Project Structure

```
wine-explorer/
├── .github/
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── public/
│   ├── index.html
│   ├── red-wine.csv
│   ├── white-wine.csv
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── DatasetSelector.js
│   │   ├── FilterPanel.js
│   │   ├── VisualizationArea.js
│   │   ├── InfoPanel.js
│   │   └── App.js
│   ├── data/
│   │   ├── wine-data-manager.js
│   │   └── csv-loader.js
│   ├── utils/
│   │   ├── chart-renderer.js
│   │   └── helpers.js
│   ├── styles/
│   │   ├── main.css
│   │   └── components.css
│   └── main.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md
├── .github/
│   └── workflows/
├── package.json
├── vite.config.js
├── cypress.config.js
├── README.md
└── .gitignore
```
