// @flow
import React from 'react';
import { listen, dispatch } from 'codesandbox-api';

import immer from 'immer';

import { Container, TestDetails, TestContainer } from './elements';

import TestElement from './TestElement';

export type IMessage = {
  type: 'message' | 'command' | 'return',
  logType: 'log' | 'warn' | 'info' | 'error',
  arguments: any[],
};

export type Status = 'idle' | 'running' | 'pass' | 'fail';

type Props = { hidden: boolean };

export type File = {
  fileName: string,
  tests: {
    [testName: string]: {
      testName: Array<string>,
      duration: ?number,
      status: Status,
      errors: Array<string>,
    },
  },
};

type State = {
  files: {
    [path: string]: File,
  },
};

class Tests extends React.Component<Props, State> {
  state = {
    files: {},
  };

  listener: Function;
  currentDescribeBlocks: Array<string> = [];

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
  }

  handleMessage = data => {
    if (data.type === 'test') {
      switch (data.event) {
        case 'file_start': {
          this.currentDescribeBlocks = [];
          this.setState(
            immer(this.state, state => {
              state.files[data.file] = {
                fileName: data.file,
                tests: {},
              };
            })
          );
          break;
        }
        case 'file_end': {
          break;
        }
        case 'describe_start': {
          this.currentDescribeBlocks.push(data.blockName);
          break;
        }
        case 'describe_end': {
          this.currentDescribeBlocks.pop();
          break;
        }
        case 'add_test': {
          const testName = [...this.currentDescribeBlocks, data.testName];

          this.setState(
            immer(this.state, state => {
              state.files[data.file].tests[testName.join('||||')] = {
                status: 'idle',
                errors: [],
                testName,
              };
            })
          );
          break;
        }
        case 'test_start': {
          const testName = [...data.test.blocks, data.test.name];

          this.setState(
            immer(this.state, state => {
              const test = state.files[data.file].tests[testName.join('||||')];
              test.status = 'running';
              test.running = true;
            })
          );
          break;
        }
        case 'test_end': {
          const testName = [...data.test.blocks, data.test.name];

          this.setState(
            immer(this.state, state => {
              const test = state.files[data.file].tests[testName.join('||||')];
              test.status = data.test.status;
              test.running = false;
              test.errors = data.test.errors;
              test.duration = data.test.duration;
            })
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <Container>
        <TestContainer>
          <div
            style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            }}
          >
            Test Summary
          </div>
          {Object.keys(this.state.files)
            .sort()
            .map(fileName => (
              <TestElement file={this.state.files[fileName]} key={fileName} />
            ))}
        </TestContainer>
        <TestDetails>Test Details</TestDetails>
      </Container>
    );
  }
}

export default {
  title: 'Tests',
  Content: Tests,
  actions: [],
};
