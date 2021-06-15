import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { UIReducer, UIState } from './ui/ui.reducer';
import { ApplicationReducer, ApplicationState } from './application/application.reducer';

export interface AppState {
  ui: UIState;
  application: ApplicationState;
}

const reducer = combineReducers<AppState>({
  ui: UIReducer,
  application: ApplicationReducer
});

const store: Store<AppState> = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export { store };
