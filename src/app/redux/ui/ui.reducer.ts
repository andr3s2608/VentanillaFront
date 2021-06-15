import { UIActionTypes, UI_SIDENAV, UI_LOADING } from './ui.types';

export interface UIState {
  loading: boolean;
  sidenav: boolean;
}

/** Estado inicial del UI */
const initialState: UIState = {
  loading: false,
  sidenav: true
};

function UIReducer(state = initialState, action: UIActionTypes): UIState {
  switch (action.type) {
    case UI_LOADING:
      return { ...state, loading: action.loading };

    case UI_SIDENAV:
      return { ...state, sidenav: action.toggle };

    default:
      return state;
  }
}

export { UIReducer };
