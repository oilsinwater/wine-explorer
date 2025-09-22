export type WineDataPoint = {
  'fixed acidity': number;
  'volatile acidity': number;
  'citric acid': number;
  'residual sugar': number;
  chlorides: number;
  'free sulfur dioxide': number;
  'total sulfur dioxide': number;
  density: number;
  pH: number;
  sulphates: number;
  alcohol: number;
  quality: number;
};

export type WineDataSet = 'red' | 'white';
