import { GridTypes, GRID, GRID_RESET, IItemDataSource } from './grid.types';

export interface GridState {
  dataSource: IItemDataSource[];
}

/** Estado inicial del Application */
const initialState: GridState = {
  dataSource: []
};

function GridReducer(state = initialState, action: GridTypes): GridState {
  switch (action.type) {
    case GRID:
      let localState = [...state.dataSource];
      const storage = localStorage.getItem('grid');
      if (storage) {
        const storageParse = JSON.parse(storage);
        localState = [...state.dataSource, ...storageParse];
      }
      localStorage.setItem('grid', JSON.stringify(localState));
      return { ...state, dataSource: [...localState, action.data] };

    case GRID_RESET:
      return initialState;

    default:
      return state;
  }
}

export { GridReducer };
