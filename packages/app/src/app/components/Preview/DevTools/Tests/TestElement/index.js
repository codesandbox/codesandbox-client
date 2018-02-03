// @flow
import React, { Component } from 'react';
import Tooltip from 'common/components/Tooltip';

import PlayIcon from 'react-icons/lib/go/playback-play';
import FileIcon from 'react-icons/lib/md/insert-drive-file';

import type { File, Status } from '../';

import { Container, FileName, Path, FileData, Actions } from './elements';

import { StatusElements } from '../elements';

type Props = {
  file: File,
  selectFile: (file: File) => void,
  selectedFile: ?File,
  status: Status,
  runTests: (file: File) => void,
  openFile: (path: string) => void,
};

class TestElement extends Component<Props> {
  selectFile = () => {
    this.props.selectFile(this.props.file);
  };

  runTests = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
          <Actions>
            <Tooltip title="Open File">
              <FileIcon onClick={this.openFile} />
            </Tooltip>
            <Tooltip title="Run Tests">
              <PlayIcon onClick={this.runTests} />
            </Tooltip>
          </Actions>
        </FileData>
      </Container>
    );
  }
}

export default TestElement;
