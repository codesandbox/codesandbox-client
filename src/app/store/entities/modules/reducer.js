// @flow
import type { Module } from './';

import findType from '../../../utils/find-type';

export const CHANGE_CODE = 'CHANGE_CODE';

export const actions = {
  changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
};

const DEFAULT_CODE = `import React from 'react';
import Welcome from 'Welcome';

export default () => <Welcome name="world" />;
`;

const DEFAULT_2_CODE = `import React from 'react';
import styled from 'styled-components';

const Container = styled.default.div\`
  font-family: 'Open Sans', sans-serif;
  font-size: 32px;
  text-align: center;
\`

export default class Welcome extends React.Component {
  render() {
    return (
      <Container>
        <h1>Hello {this.props.name}!</h1>
        <h2>Welcome to CodeSandbox</h2>
      </Container>
    );
  }
};
`;

const DEFAULT_3_CODE = `export function sum(a, b) {
  return a + b;
};
`;

type State = {
  [id: string]: Module;
};

const initialState: State = {
  1: {
    id: '1',
    code: DEFAULT_CODE,
    name: 'Default',
    sandboxId: '1',
    type: 'react',
  },
  2: {
    id: '2',
    code: DEFAULT_2_CODE,
    name: 'Welcome',
    sandboxId: '1',
    type: 'react',
  },
  3: {
    id: '3',
    code: DEFAULT_3_CODE,
    name: 'Functions',
    sandboxId: '1',
    type: 'function',
  },
  4: {
    id: '4',
    code: DEFAULT_2_CODE,
    name: 'Hey',
    sandboxId: '1',
    type: 'react',
  },
  5: {
    id: '5',
    code: DEFAULT_2_CODE,
    name: 'Hoi',
    sandboxId: '1',
    type: 'react',
  },
  6: {
    id: '6',
    code: DEFAULT_2_CODE,
    name: 'Dependency here',
    sandboxId: '1',
    type: 'react',
  },
  7: {
    id: '7',
    code: DEFAULT_2_CODE,
    name: 'Dependency there',
    sandboxId: '1',
    type: 'react',
  },
};

const moduleReducer = (state: Module, action: Object): Module => {
  switch (action.type) {
    case CHANGE_CODE:
      return {
        ...state,
        code: action.code,
        type: findType(action.code),
      };
    default:
      return state;
  }
};

export default (state: State = initialState, action: Object): State => {
  switch (action.type) {
    case CHANGE_CODE:
      return {
        ...state,
        [action.id]: moduleReducer(state[action.id], action),
      };
    default:
      return state;
  }
};
