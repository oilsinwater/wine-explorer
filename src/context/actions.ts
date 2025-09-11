export enum AppActionType {
  OPEN_API_MODAL = 'OPEN_API_MODAL',
  CLOSE_API_MODAL = 'CLOSE_API_MODAL',
  SET_DATASET = 'SET_DATASET',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}

export const openApiModal = (): AppAction => ({
  type: AppActionType.OPEN_API_MODAL,
});

export const closeApiModal = (): AppAction => ({
  type: AppActionType.CLOSE_API_MODAL,
});

export const setDataset = (dataset: 'red' | 'white'): AppAction => ({
  type: AppActionType.SET_DATASET,
  payload: dataset,
});

export const setLoading = (loading: boolean): AppAction => ({
  type: AppActionType.SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null): AppAction => ({
  type: AppActionType.SET_ERROR,
  payload: error,
});
