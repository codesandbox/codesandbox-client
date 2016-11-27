// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import thunk from './services/thunk-middleware';
import rootReducer from './reducers';
import saga from './sagas';

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(
      thunk,
      sagaMiddleware,
    )),
  );
  sagaMiddleware.run(saga);

  if (process.env.NODE_ENV === 'development') {
    window.store = store;
  }

  return store;
};

