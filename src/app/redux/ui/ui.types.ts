const UI_LOADING = '[UI]::Loading';
const UI_SIDENAV = '[UI]::Sidenav';

interface ILoadingAction {
  type: typeof UI_LOADING;
  loading: boolean;
}

interface IToggleSidenavAction {
  type: typeof UI_SIDENAV;
  toggle: boolean;
}

export type UIActionTypes = ILoadingAction | IToggleSidenavAction;

export { UI_LOADING, UI_SIDENAV };
