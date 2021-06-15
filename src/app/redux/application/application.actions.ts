import { ApplicationActionTypes, APPLICATION_MENU, APPLICATION_RESET, IItemMenu } from './application.types';

function SetApplicationMenu(menu: IItemMenu[]): ApplicationActionTypes {
  return {
    type: APPLICATION_MENU,
    menu
  };
}

function ResetApplication(): ApplicationActionTypes {
  return {
    type: APPLICATION_RESET
  };
}

export { SetApplicationMenu, ResetApplication };
