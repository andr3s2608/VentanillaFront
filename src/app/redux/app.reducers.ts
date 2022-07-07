import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { UIReducer, UIState } from './ui/ui.reducer';
import { ApplicationReducer, ApplicationState } from './application/application.reducer';
import { GridState, GridReducer } from './Grid/grid.reducer';
import { ViewLicenceReducer } from './controlViewLicence/controlViewLicence.reducer';
import { DireccionReducer } from './dirrecion/direccion.reducer';

export interface AppState {
  ui: UIState;
  application: ApplicationState;
  grid: GridState;
  viewLicence: any;
  direccion: any;
}

const reducer = combineReducers<AppState>({
  ui: UIReducer,
  application: ApplicationReducer,
  grid: GridReducer,
  viewLicence: ViewLicenceReducer,
  direccion: DireccionReducer
});

const store: Store<AppState> = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export { store };
