import * as React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import PlayIcon from 'react-icons/lib/go/playback-play';
import FileIcon from 'react-icons/lib/md/insert-drive-file';
import ExpandTestsIcon from 'react-icons/lib/fa/expand';
import CollapseTestsIcon from 'react-icons/lib/fa/minus';

import { File, Status } from '..';

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
  file: File;
  selectFile: (file: File) => void;
  selectedFile: File | undefined;
  status: Status;
  runTests: (file: File) => void;
  openFile: (path: string) => void;
  isExpanded: Boolean;
  onFileExpandToggle: (file: File) => void;
};

export class TestElement extends React.Component<Props> {
  selectFile = () => {
    this.props.selectFile(this.props.file);
  };

  toggleFileExpansion = () => {
    this.props.onFileExpandToggle(this.props.file);
  };

  runTests = (e: React.MouseEvent<React.ReactSVGElement>) => {
    e.preventDefault();
    this.props.runTests(this.props.file);
  };

  openFile = (e: React.MouseEvent<React.ReactSVGElement>) => {
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
        <FileData>
          <StatusElement />
          <Path>{splittedPath.join('/')}/</Path>
          <FileName>{fileName}</FileName>
          <Actions>
            <Tooltip content="Open File">
              <FileIcon onClick={this.openFile} />
            </Tooltip>
            <Tooltip content="Run Tests">
              <PlayIcon onClick={this.runTests} />
            </Tooltip>
            <Tooltip
              content={
                this.props.isExpanded ? 'Collapse Tests' : 'Expand Tests'
              }
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
                  <Test status={test.status} key={tName}>
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
