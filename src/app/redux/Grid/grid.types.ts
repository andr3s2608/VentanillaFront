const GRID = '[GRID]::Set dataSource.';
const GRID_RESET = '[GRID]::Reset Datasource state.';
const GRID_ADD = '[GRID]::Reset Datasource state.';

interface ISetGrid {
  type: typeof GRID;
  data: IItemDataSource;
}

interface IResetGrid {
  type: typeof GRID_RESET;
}

export interface IItemDataSource {
  [x: string]: string;
}

export type GridTypes = ISetGrid | IResetGrid;

export { GRID_RESET, GRID, GRID_ADD };
