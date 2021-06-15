const APPLICATION_MENU = '[APPLICATION]::Set MENU.';
const APPLICATION_RESET = '[APPLICATION]::Reset APPLICATION state.';

interface ISetApplicationMenu {
  type: typeof APPLICATION_MENU;
  menu: IItemMenu[];
}
interface IResetApplication {
  type: typeof APPLICATION_RESET;
}

export interface IItemMenu {
  name: string;
  path?: string;
  children?: IItemMenu[];
}

export type ApplicationActionTypes = ISetApplicationMenu | IResetApplication;

export { APPLICATION_MENU, APPLICATION_RESET };
