// @flow
import React, { Component } from 'react';
import ReactShow from 'react-show';

import type { File, Status } from '../';

import {
  Container,
  FileName,
  Path,
  Tests,
  FileData,
  Test,
  Block,
  TestName,
} from './elements';

import { StatusElements } from '../elements';

type Props = {
  file: File,
  selectFile: (file: File) => void,
  selectedFile: ?File,
  status: Status,
};

class TestElement extends Component<Props> {
  selectFile = () => {
    this.props.selectFile(this.props.file);
  };

  render() {
    const { file, status } = this.props;

    const splittedPath = file.fileName.split('/');
    const fileName = splittedPath.pop();

    const testKeys = Object.keys(file.tests);

    const StatusElement = StatusElements[status];

    return (
      <Container>
        <FileData
          selected={this.props.selectedFile === this.props.file}
          onClick={this.selectFile}
        >
          <StatusElement />
          <Path>{splittedPath.join('/')}/</Path>
          <FileName>{fileName}</FileName>
        </FileData>

        <ReactShow
          duration={300}
          show={this.props.selectedFile === this.props.file}
        >
          <Tests>
            {testKeys.map(tName => {
              const test = file.tests[tName];

              const TestStatusElement = StatusElements[test.status];
              const testParts = [...test.testName];
              const testName = testParts.pop();
              return (
                <Test selected={test === this.props.selectedFile} key={tName}>
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
