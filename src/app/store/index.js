// @flow
import { createStore, applyMiddleware, compose } from 'redux';

import thunk from './services/middleware/thunk-middleware';
import rootReducer from './root-reducer';

function getComposeEnhancers() {
  if (
    process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line
  ) {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // eslint-disable-line
  }
  return compose;
}

export default () => {
  const composeEnhancers = getComposeEnhancers();
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk)),
  );

  if (process.env.NODE_ENV === 'development') {
    window.store = store;
  }

  return store;
};
