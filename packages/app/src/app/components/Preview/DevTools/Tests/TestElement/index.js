// @flow
import React, { Component } from 'react';
import ReactShow from 'react-show';

import type { File, Status } from '../';

import {
  Container,
  Success,
  Fail,
  Loading,
  Dot,
  FileName,
  Path,
  Tests,
  FileData,
  Test,
  Block,
  TestName,
} from './elements';

type Props = {
  file: File,
};
type State = {
  isOpen: boolean,
};

const StatusElements = {
  pass: Success,
  fail: Fail,
  running: Loading,
  idle: Dot,
};

class TestElement extends Component<Props, State> {
  state = {
    isOpen: false,
  };

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  _lastFile = null;
  _lastStatus: Status | null = null;
  getStatus = (file: File) => {
    // Simple memoization
    if (file === this._lastFile && this._lastStatus != null) {
      return this._lastStatus;
    }

    this._lastFile = file;
    this._lastStatus = Object.keys(file.tests).reduce((prev, next) => {
      const test = file.tests[next];
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
    }, 'pass');

    return this._lastStatus;
  };

  componentWillReceiveProps(nextProps: Props) {
    const status = this.getStatus(nextProps.file);

    if (status === 'fail') {
      this.setState({ isOpen: true });
    }
  }

  render() {
    const { file } = this.props;

    const splittedPath = file.fileName.split('/');
    const fileName = splittedPath.pop();

    const testKeys = Object.keys(file.tests);

    const status = this.getStatus(file);

    const StatusElement = StatusElements[status];

    return (
      <Container>
        <FileData onClick={this.toggleOpen}>
          <StatusElement />
          <Path>{splittedPath.join('/')}/</Path>
          <FileName>{fileName}</FileName>
        </FileData>

        <ReactShow duration={300} show={this.state.isOpen}>
          <Tests>
            {testKeys.map(tName => {
              const test = file.tests[tName];

              const TestStatusElement = StatusElements[test.status];
              const testParts = [...test.testName];
              const testName = testParts.pop();
              return (
                <Test key={tName}>
                  <TestStatusElement />
                  {testParts.map((part, i) => (
                    <Block last={i === testParts.length - 1} key={part}>
                      <span style={{ zIndex: 10 }}>{part}</span>
                    </Block>
                  ))}
                  <TestName>{testName}</TestName>
                </Test>
              );
            })}
          </Tests>
        </ReactShow>
      </Container>
    );
  }
}

export default TestElement;
