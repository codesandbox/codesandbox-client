import Tooltip from '@codesandbox/common/es/components/Tooltip';
import * as React from 'react';
import { FaExpand, FaMinus } from 'react-icons/fa';
import { GoPlay } from 'react-icons/go';
import { MdInsertDriveFile } from 'react-icons/md';

import { StatusElements } from '../elements';
import {
  Actions,
  Block,
  Container,
  FileData,
  FileName,
  Path,
  Test,
  TestName,
  Tests,
} from './elements';
import { File, Status } from '..';

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
              <MdInsertDriveFile onClick={this.openFile} />
            </Tooltip>
            <Tooltip content="Run Tests">
              <GoPlay onClick={this.runTests} />
            </Tooltip>
            <Tooltip
              content={
                this.props.isExpanded ? 'Collapse Tests' : 'Expand Tests'
              }
            >
              {this.props.isExpanded ? (
                <FaMinus onClick={this.toggleFileExpansion} />
              ) : (
                <FaExpand onClick={this.toggleFileExpansion} />
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
