import { UIActionTypes, UI_SIDENAV, UI_LOADING } from './ui.types';

function Loading(loading: boolean): UIActionTypes {
  return {
    type: UI_LOADING,
    loading
  };
}

function ToggleSideNav(toggle: boolean): UIActionTypes {
  return {
    type: UI_SIDENAV,
    toggle
  };
}

export { Loading, ToggleSideNav };
