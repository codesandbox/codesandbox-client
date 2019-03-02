// @flow
import React, { Component } from 'react';
import Tooltip from 'common/lib/components/Tooltip';

import PlayIcon from 'react-icons/lib/go/playback-play';
import FileIcon from 'react-icons/lib/md/insert-drive-file';
import ExpandTestsIcon from 'react-icons/lib/fa/expand';
import CollapseTestsIcon from 'react-icons/lib/fa/minus';

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
  Actions,
} from './elements';

import { StatusElements } from '../elements';

type Props = {
  file: File,
  selectFile: (file: File) => void,
  selectedFile: ?File,
  status: Status,
  runTests: (file: File) => void,
  openFile: (path: string) => void,
  isExpanded: Boolean,
  onFileExpandToggle: (file: File) => void,
};

class TestElement extends Component<Props> {
  selectFile = () => {
    this.props.selectFile(this.props.file);
  };

  toggleFileExpansion = () => {
    this.props.onFileExpandToggle(this.props.file);
  };

  runTests = (e: MouseEvent) => {
    e.preventDefault();
    this.props.runTests(this.props.file);
  };

  openFile = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.openFile(this.props.file.fileName);
  };

  render() {
    const { file, status } = this.props;

    const splittedPath = file.fileName.split('/');
    const fileName = splittedPath.pop();

    const testKeys = Object.keys(file.tests);

    const StatusElement = StatusElements[status];

    return (
      <Container
        onClick={this.selectFile}
        selected={file === this.props.selectedFile}
      >
        <FileData selected={this.props.selectedFile === this.props.file}>
          <StatusElement />
          <Path>{splittedPath.join('/')}/</Path>
          <FileName>{fileName}</FileName>
          <Actions>
            <Tooltip title="Open File">
              <FileIcon onClick={this.openFile} />
            </Tooltip>
            <Tooltip title="Run Tests">
              <PlayIcon onClick={this.runTests} />
            </Tooltip>
            <Tooltip
              title={this.props.isExpanded ? 'Collapse Tests' : 'Expand Tests'}
            >
              {this.props.isExpanded ? (
                <CollapseTestsIcon onClick={this.toggleFileExpansion} />
              ) : (
                <ExpandTestsIcon onClick={this.toggleFileExpansion} />
              )}
            </Tooltip>
          </Actions>
        </FileData>
        {this.props.isExpanded && (
          <Tests>
            {testKeys
              .filter(t => file.tests[t].status === 'fail')
              .map(tName => {
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
        )}
      </Container>
    );
  }
}

export default TestElement;
