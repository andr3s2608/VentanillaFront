import { GridTypes, GRID, GRID_RESET, IItemDataSource } from './grid.types';

function SetGrid(data: IItemDataSource): GridTypes {
  return {
    type: GRID,
    data
  };
}

function ResetGrid(): GridTypes {
  return {
    type: GRID_RESET
  };
}

export { SetGrid, ResetGrid };
