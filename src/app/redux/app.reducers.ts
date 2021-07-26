import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { UIReducer, UIState } from './ui/ui.reducer';
import { ApplicationReducer, ApplicationState } from './application/application.reducer';
import { GridState, GridReducer } from './Grid/grid.reducer';

export interface AppState {
  ui: UIState;
  application: ApplicationState;
  grid: GridState;
}

const reducer = combineReducers<AppState>({
  ui: UIReducer,
  application: ApplicationReducer,
  grid: GridReducer
});

const store: Store<AppState> = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export { store };
