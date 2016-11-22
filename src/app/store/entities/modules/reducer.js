// @flow
import type { Module } from './';

export const CHANGE_CODE = 'CHANGE_CODE';
export const SET_ERROR = 'SET_ERROR';

export const actions = {
  changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
  setError: (id: string, error: Error) => ({ type: SET_ERROR, id, error }),
};

const DEFAULT_CODE = `import React from 'react';
export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <h2>Start typing here to edit this component</h2>
      </div>
    )
  }
};
`;

const DEFAULT_2_CODE = `import React from 'react';
import Default from 'Default'

const hack = (el) => {
  // throw new Error(el.ownerDocument.cookie);
}

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1 ref={hack}>Second component!</h1>
      </div>
    )
  }
};
`;

const DEFAULT_3_CODE = `
  export function sum(a, b) {
    return a + b;
  };
`;

type State = {
  [id: string]: Module;
};

const initialState: State = {
  1: {
    id: 1,
    code: DEFAULT_CODE,
    error: null,
    name: 'Default',
    sandboxId: 1,
  },
  2: {
    id: 2,
    code: DEFAULT_2_CODE,
    error: null,
    name: 'Second',
    sandboxId: 1,
  },
  3: {
    id: 3,
    code: DEFAULT_3_CODE,
    error: null,
    name: 'Functions',
    sandboxId: 1,
  },
};

const moduleReducer = (state: Module, action: Object): Module => {
  switch (action.type) {
    case CHANGE_CODE:
      return {
        ...state,
        code: action.code,
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case CHANGE_CODE:
    case SET_ERROR:
      return {
        ...state,
        [action.id]: moduleReducer(state[action.id], action),
      };
    default:
      return state;
  }
};
