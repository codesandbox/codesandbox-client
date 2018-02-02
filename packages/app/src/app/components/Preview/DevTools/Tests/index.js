// @flow
import React from 'react';
import { listen, dispatch } from 'codesandbox-api';

import immer from 'immer';

import { Container, TestDetails, TestContainer } from './elements';

import TestElement from './TestElement';
import TestDetailsContent from './TestDetails';

export type IMessage = {
  type: 'message' | 'command' | 'return',
  logType: 'log' | 'warn' | 'info' | 'error',
  arguments: any[],
};

export type Status = 'idle' | 'running' | 'pass' | 'fail';

type Props = {
  hidden: boolean,
  updateStatus: (type: 'warning' | 'error' | 'info' | 'clear') => void,
};

export type TestError = Error & {
  matcherResult?: {
    actual: any,
    expected: any,
    name: string,
    pass: boolean,
  },
  mappedErrors?: Array<{
    fileName: string,
    _originalFunctionName: string,
    _originalColumnNumber: number,
    _originalLineNumber: number,
    _originalScriptCode: Array<{
      lineNumber: number,
      content: string,
      highlight: boolean,
    }>,
  }>,
};

export type Test = {
  testName: Array<string>,
  duration: ?number,
  status: Status,
  errors: Array<TestError>,
};

export type File = {
  fileName: string,
  transpilationError?: TestError,
  tests: {
    [testName: string]: Test,
  },
};

type State = {
  selectedFilePath: ?string,
  files: {
    [path: string]: File,
  },
};

class Tests extends React.Component<Props, State> {
  state = {
    files: {},
    selectedFilePath: null,
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

  selectFile = (file: File) => {
    this.setState({ selectedFilePath: file.fileName });
  };

  handleMessage = data => {
    if (data.type === 'test') {
      switch (data.event) {
        case 'total_test_start': {
          this.props.updateStatus('clear');
          this.currentDescribeBlocks = [];
          this.setState({
            files: {},
            selectedFilePath: this.state.selectedFilePath,
          });
          break;
        }
        case 'add_file': {
          this.setState(
            immer(this.state, state => {
              state.files[data.path] = {
                tests: {},
                fileName: data.path,
              };
            })
          );
          break;
        }
        case 'transpilation_error': {
          this.setState(
            immer(this.state, state => {
              if (state.files[data.path]) {
                state.files[data.path].transpilationError = data.error;
              }
            })
          );
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
              if (!state.files[data.path]) {
                state.files[data.path] = {
                  tests: {},
                  fileName: data.path,
                };
              }

              state.files[data.path].tests[testName.join('||||')] = {
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
              const test =
                state.files[data.test.path].tests[testName.join('||||')];
              test.status = 'running';
              test.running = true;
            })
          );
          break;
        }
        case 'test_end': {
          const testName = [...data.test.blocks, data.test.name];

          if (data.test.status === 'fail') {
            this.props.updateStatus('error');
          } else if (data.test.status === 'pass') {
            this.props.updateStatus('info');
          }

          this.setState(
            immer(this.state, state => {
              const test =
                state.files[data.test.path].tests[testName.join('||||')];
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

  _lastFiles: {
    [path: string]: {
      file: File,
      status: Status,
    },
  } = {};
  getStatus = (file: ?File): Status => {
    if (file == null) {
      return 'idle';
    }

    const lastFile = this._lastFiles[file.fileName];

    // Simple memoization
    if (lastFile && file === lastFile.file && lastFile.status != null) {
      return lastFile.status;
    }

    if (file.transpilationError) {
      return 'fail';
    }

    const tests = file.tests;
    const status = Object.keys(tests).reduce((prev, next) => {
      const test = tests[next];
      if (test.status !== 'idle' && prev === 'idle') {
        return test.status;
      }

      if (test.status === 'pass' || prev !== 'pass') {
        return prev;
      }

      if (test.status === 'fail') {
        return 'fail';
      }

      if (test.status === 'running') {
        return 'running';
      }

      return prev;
    }, 'idle');

    this._lastFiles[file.fileName] = { file, status };

    return status;
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    const { selectedFilePath } = this.state;
    const selectedFile = this.state.files[selectedFilePath || ''];

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
              <TestElement
                selectFile={this.selectFile}
                selectedFile={selectedFile}
                file={this.state.files[fileName]}
                status={this.getStatus(this.state.files[fileName])}
                key={fileName}
              />
            ))}
        </TestContainer>
        <TestDetails>
          <TestDetailsContent
            status={this.getStatus(selectedFile)}
            file={selectedFile}
          />
        </TestDetails>
      </Container>
    );
  }
}

export default {
  title: 'Tests',
  Content: Tests,
  actions: [],
};
