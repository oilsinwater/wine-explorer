# Data Models

## WineDataPoint

**Purpose:** Represents a single wine sample with its physicochemical properties and quality rating

**Key Attributes:**
- fixedAcidity: number - Fixed acidity content
- volatileAcidity: number - Volatile acidity content
- citricAcid: number - Citric acid content
- residualSugar: number - Residual sugar content
- chlorides: number - Chloride content
- freeSulfurDioxide: number - Free sulfur dioxide content
- totalSulfurDioxide: number - Total sulfur dioxide content
- density: number - Density of the wine
- pH: number - pH level
- sulphates: number - Sulphate content
- alcohol: number - Alcohol content percentage
- quality: number - Quality rating (ordinal scale)

### TypeScript Interface

```typescript
interface WineDataPoint {
  fixedAcidity: number;
  volatileAcidity: number;
  citricAcid: number;
  residualSugar: number;
  chlorides: number;
  freeSulfurDioxide: number;
  totalSulfurDioxide: number;
  density: number;
  pH: number;
  sulphates: number;
  alcohol: number;
  quality: number;
}
```

### Relationships

- None (flat data structure from CSV)

## DatasetInfo

**Purpose:** Metadata about the wine dataset

**Key Attributes:**
- type: 'red' | 'white' - Type of wine
- source: string - Source of the dataset
- doi: string - Digital Object Identifier
- totalInstances: number - Total number of samples
- features: string[] - List of feature names

### TypeScript Interface

```typescript
interface DatasetInfo {
  type: 'red' | 'white';
  source: string;
  doi: string;
  totalInstances: number;
  features: string[];
}
```

### Relationships

- None
