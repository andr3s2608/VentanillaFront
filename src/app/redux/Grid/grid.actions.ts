import { GridTypes, GRID, GRID_RESET, IItemDataSource } from './grid.types';

function SetGrid(data: IItemDataSource): GridTypes {
  return {
    type: GRID,
    data
  };
}

function ResetApplication(): GridTypes {
  return {
    type: GRID_RESET
  };
}

export { SetGrid, ResetApplication };
