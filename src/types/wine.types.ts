export interface WineDataPoint {
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

export interface DatasetInfo {
  type: 'red' | 'white';
  source: string;
  doi: string;
  totalInstances: number;
  features: string[];
}

export interface WineDataset {
  info: DatasetInfo;
  data: WineDataPoint[];
}
