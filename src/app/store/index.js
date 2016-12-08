// @flow
import { createStore, applyMiddleware, compose } from 'redux';

import thunk from './services/thunk-middleware';
import rootReducer from './reducers';

export default () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(
      thunk,
    )),
  );

  if (process.env.NODE_ENV === 'development') {
    window.store = store;
  }

  return store;
};

