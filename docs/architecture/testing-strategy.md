# Testing Strategy

## Testing Pyramid

```
E2E Tests (Cypress)
/
Integration Tests (Jest)
/
Frontend Unit Tests (Jest)
```

## Test Organization

### Frontend Tests

```
/tests
├── unit/
│   ├── components/
│   ├── data/
│   └── utils/
├── integration/
│   ├── app-flow.test.js
│   └── data-processing.test.js
└── e2e/
    ├── dataset-switching.cy.js
    ├── filtering.cy.js
    └── visualization.cy.js
```

### Backend Tests

Not applicable for this client-side only application.

### E2E Tests

```
/tests/e2e
├── dataset-switching.cy.js
├── filtering.cy.js
└── visualization.cy.js
```

## Test Examples

### Frontend Component Test

```javascript
import { DatasetSelector } from '../src/components/DatasetSelector';

describe('DatasetSelector', () => {
  it('should render both dataset options', () => {
    // Test implementation
  });

  it('should emit event when dataset is changed', () => {
    // Test implementation
  });
});
```

### Backend API Test

Not applicable for this client-side only application.

### E2E Test

```javascript
describe('Dataset Switching', () => {
  it('should switch between red and white wine datasets', () => {
    cy.visit('/');
    cy.get('[data-testid="dataset-toggle"]').click();
    cy.get('[data-testid="dataset-info"]').should('contain', 'white');
  });
});
```
