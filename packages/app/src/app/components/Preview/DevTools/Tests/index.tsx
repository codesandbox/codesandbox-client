/* eslint-disable no-param-reassign */
import * as React from 'react';
import { actions, dispatch, listen } from 'codesandbox-api';
import SplitPane from 'react-split-pane';

import immer from 'immer';

import { Container, TestDetails, TestContainer } from './elements';

import TestElement from './TestElement';
import TestDetailsContent from './TestDetails';
import TestSummary from './TestSummary';
import TestOverview from './TestOverview';
import { DevToolProps } from '..';

export type IMessage = {
  type: 'message' | 'command' | 'return';
  logType: 'log' | 'warn' | 'info' | 'error';
  arguments: any[];
};

export type Status = 'idle' | 'running' | 'pass' | 'fail';

export type TestError = Error & {
  matcherResult?: boolean;
  mappedErrors?: Array<{
    fileName: string;
    _originalFunctionName: string;
    _originalColumnNumber: number;
    _originalLineNumber: number;
    _originalScriptCode: Array<{
      lineNumber: number;
      content: string;
      highlight: boolean;
    }> | null;
  }>;
};

export type Test = {
  testName: Array<string>;
  duration: number | undefined;
  status: Status;
  errors: Array<TestError>;
  running: boolean;
  path: string;
};

export type File = {
  fileName: string;
  fileError?: TestError;
  tests: {
    [testName: string]: Test;
  };
};

type State = {
  selectedFilePath: string | undefined;
  fileExpansionState: {
    [path: string]: Boolean;
  };
  files: {
    [path: string]: File;
  };
  running: boolean;
  watching: boolean;
};

type SandboxMessage = { type: 'test' | 'done' } & (
  | InitializedTestsMessage
  | TestCountMessage
  | TotalTestStartMessage
  | TotalTestEndMessage
  | AddFileMessage
  | RemoveFileMessage
  | FileErrorMessage
  | DescribeStartMessage
  | DescribeEndMessage
  | AddTestMessage
  | TestStartMessage
  | TestEndMessage);

interface InitializedTestsMessage {
  event: 'initialize_tests';
}

interface TestCountMessage {
  event: 'test_count';
  count: number;
}

interface TotalTestStartMessage {
  event: 'total_test_start';
}

interface TotalTestEndMessage {
  event: 'total_test_end';
}

interface AddFileMessage {
  event: 'add_file';
  path: string;
}

interface RemoveFileMessage {
  event: 'remove_file';
  path: string;
}

interface FileErrorMessage {
  event: 'file_error';
  path: string;
  error: TestError;
}

interface DescribeStartMessage {
  event: 'describe_start';
  blockName: string;
}

interface DescribeEndMessage {
  event: 'describe_end';
}

interface AddTestMessage {
  event: 'add_test';
  testName: string;
  path: string;
}

type TestMessage = Test & {
  blocks: string[];
  name: string;
  path: string;
};

interface TestStartMessage {
  event: 'test_start';
  test: TestMessage;
}

interface TestEndMessage {
  event: 'test_end';
  test: TestMessage;
}

const INITIAL_STATE = {
  files: {},
  selectedFilePath: null,
  fileExpansionState: {},
  running: true,
  watching: true,
};

class Tests extends React.Component<DevToolProps, State> {
  state = INITIAL_STATE;

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

  componentWillReceiveProps(nextProps: DevToolProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.setState({
        files: {},
        selectedFilePath: null,
        running: true,
      });
    }

    if (this.props.hidden && !nextProps.hidden) {
      this.runAllTests();
    }
  }

  selectFile = (file: File) => {
    this.setState({
      selectedFilePath:
        file.fileName === this.state.selectedFilePath ? null : file.fileName,
    });
  };

  toggleFileExpansion = (file: File) => {
    this.setState(
      immer(this.state, state => {
        state.fileExpansionState[file.fileName] = !state.fileExpansionState[
          file.fileName
        ];
      })
    );
  };

  handleMessage = (data: SandboxMessage) => {
    if (data.type === 'done' && this.state.watching && !this.props.hidden) {
      this.runAllTests();
    } else if (data.type === 'test') {
      switch (data.event) {
        case 'initialize_tests': {
          this.currentDescribeBlocks = [];
          if (this.props.updateStatus) {
            this.props.updateStatus('clear');
          }
          this.setState(INITIAL_STATE);
          break;
        }
        case 'test_count': {
          const { updateStatus } = this.props;
          if (updateStatus) {
            updateStatus('clear');
            updateStatus('info', data.count);
          }
          break;
        }
        case 'total_test_start': {
          this.currentDescribeBlocks = [];
          if (this.props.updateStatus) {
            this.props.updateStatus('clear');
          }
          this.setState({
            ...this.state,
            running: true,
          });
          break;
        }
        case 'total_test_end': {
          this.setState({
            ...this.state,
            running: false,
          });

          const files = Object.keys(this.state.files);
          const failingTests = files.filter(
            f => this.getStatus(this.state.files[f]) === 'fail'
          ).length;
          const passingTests = files.filter(
            f => this.getStatus(this.state.files[f]) === 'pass'
          ).length;

          if (this.props.updateStatus) {
            if (failingTests > 0) {
              this.props.updateStatus('error', failingTests);
            } else if (passingTests === files.length) {
              this.props.updateStatus('success', passingTests);
            } else {
              // Not all tests are run
              this.props.updateStatus('warning', files.length - passingTests);
            }
          }

          break;
        }

        case 'add_file': {
          this.setState(
            immer(this.state, state => {
              state.files[data.path] = {
                tests: {},
                fileName: data.path,
              };

              state.fileExpansionState[data.path] = true;
            })
          );
          break;
        }
        case 'remove_file': {
          this.setState(
            immer(this.state, state => {
              if (state.files[data.path]) {
                delete state.files[data.path];
              }

              delete state.fileExpansionState[data.path];
            })
          );
          break;
        }
        case 'file_error': {
          this.setState(
            immer(this.state, state => {
              if (state.files[data.path]) {
                state.files[data.path].fileError = data.error;
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

                state.fileExpansionState[data.path] = true;
              }

              state.files[data.path].tests[testName.join('||||')] = {
                status: 'idle',
                errors: [],
                testName,
                path: data.path,
              };
            })
          );
          break;
        }
        case 'test_start': {
          const test = data.test;
          const testName = [...test.blocks, test.name];

          this.setState(
            immer(this.state, state => {
              if (!state.files[test.path]) {
                state.files[test.path] = {
                  tests: {},
                  fileName: test.path,
                };
              }

              const currentTest =
                state.files[test.path].tests[testName.join('||||')];
              if (!currentTest) {
                state.files[test.path].tests[testName.join('||||')] = {
                  status: 'running',
                  running: true,
                  testName,
                  path: test.path,
                };
              } else {
                currentTest.status = 'running';
                currentTest.running = true;
              }
            })
          );
          break;
        }
        case 'test_end': {
          const test = data.test;
          const testName = [...test.blocks, test.name];

          this.setState(
            immer(this.state, state => {
              const existingTest =
                state.files[test.path].tests[testName.join('||||')];

              if (existingTest) {
                existingTest.status = test.status;
                existingTest.running = false;
                existingTest.errors = test.errors;
                existingTest.duration = test.duration;
              } else {
                state.files[test.path].tests[testName.join('||||')] = {
                  status: test.status,
                  running: false,
                  errors: test.errors,
                  duration: test.duration,
                  testName,
                  path: test.path,
                };
              }
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
      file: File;
      status: Status;
    };
  } = {};
  getStatus = (file: File | undefined): Status => {
    if (file == null) {
      return 'idle';
    }

    const lastFile = this._lastFiles[file.fileName];

    // Simple memoization
    if (lastFile && file === lastFile.file && lastFile.status != null) {
      return lastFile.status;
    }

    if (file.fileError) {
      return 'fail';
    }

    const tests = file.tests;
    const status = Object.keys(tests).reduce(
      (prev: Status, next: Status): Status => {
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
      },
      'idle'
    ) as Status;

    this._lastFiles[file.fileName] = { file, status };

    return status;
  };

  toggleWatching = () => {
    dispatch({
      type: 'set-test-watching',
      watching: !this.state.watching,
    });
    this.setState({ watching: !this.state.watching });
  };

  runAllTests = () => {
    this.setState({ files: {} }, () => {
      dispatch({
        type: 'run-all-tests',
      });
    });
  };

  runTests = (file: File) => {
    this.setState(
      immer(this.state, state => {
        state.files[file.fileName].tests = {};
      }),
      () => {
        dispatch({
          type: 'run-tests',
          path: file.fileName,
        });
      }
    );
  };

  openFile = (path: string) => {
    dispatch(actions.editor.openModule(path));
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    const { selectedFilePath } = this.state;
    const selectedFile = this.state.files[selectedFilePath || ''];

    const fileStatuses = {};
    Object.keys(this.state.files).forEach(path => {
      fileStatuses[path] = this.getStatus(this.state.files[path]);
    });

    const tests = [];
    Object.keys(this.state.files).forEach(path => {
      const file = this.state.files[path];
      Object.keys(file.tests).forEach(t => {
        tests.push(file.tests[t]);
      });
    });

    // Types for split-pane don't work because they're in root.
    const TSplitPane = SplitPane as any;
    return (
      <Container>
        <TSplitPane split="horizontal" defaultSize={'50%'}>
          <TestContainer>
            <TestSummary
              running={this.state.running}
              watching={this.state.watching}
              toggleWatching={this.toggleWatching}
              runAllTests={this.runAllTests}
              fileStatuses={fileStatuses}
              files={this.state.files}
              tests={tests}
            />

            <div style={{ marginTop: '1rem' }}>
              {Object.keys(this.state.files)
                .sort()
                .map(fileName => (
                  <TestElement
                    selectFile={this.selectFile}
                    selectedFile={selectedFile}
                    file={this.state.files[fileName]}
                    status={fileStatuses[fileName]}
                    key={fileName}
                    runTests={this.runTests}
                    openFile={this.openFile}
                    isExpanded={this.state.fileExpansionState[fileName]}
                    onFileExpandToggle={this.toggleFileExpansion}
                  />
                ))}
            </div>
          </TestContainer>
          <TestDetails>
            {selectedFile ? (
              <TestDetailsContent
                status={this.getStatus(selectedFile)}
                file={selectedFile}
                openFile={this.openFile}
                runTests={this.runTests}
              />
            ) : (
              <TestOverview tests={tests} openFile={this.openFile} />
            )}
          </TestDetails>
        </TSplitPane>
      </Container>
    );
  }
}

export default {
  id: 'codesandbox.tests',
  title: 'Tests',
  Content: Tests,
  actions: [],
};
