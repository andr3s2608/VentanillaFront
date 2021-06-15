import { ApplicationActionTypes, APPLICATION_MENU, APPLICATION_RESET, IItemMenu } from './application.types';

export interface ApplicationState {
  menu: IItemMenu[];
}

/** Estado inicial del Application */
const initialState: ApplicationState = {
  menu: []
};

function ApplicationReducer(state = initialState, action: ApplicationActionTypes): ApplicationState {
  switch (action.type) {
    case APPLICATION_MENU:
      return { ...state, menu: action.menu };

    case APPLICATION_RESET:
      return initialState;

    default:
      return state;
  }
}

export { ApplicationReducer };
