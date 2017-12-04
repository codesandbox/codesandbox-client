import React from 'react';
import styled from 'styled-components';

import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';
import AddFileIcon from 'react-icons/lib/md/insert-drive-file';
import AddDirectoryIcon from 'react-icons/lib/md/create-new-folder';

import fadeIn from 'common/utils/animation/fade-in';
import Tooltip from 'common/components/Tooltip';

import { Icon } from '../../../Icon';

type Props = {
  className: ?string,
  hovering: boolean,
  onDelete: Function,
  onEdit: Function,
  onCreateFile: Function,
  onCreateDirectory: Function,
};

const Container = styled.div`
  display: flex;
  ${fadeIn(0)};
  vertical-align: middle;
  line-height: 1;
  align-items: center;
`;

const handleClick = func => (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  func();
};

export default ({
  className,
  hovering,
  onDelete,
  onEdit,
  onCreateFile,
  onCreateDirectory,
}: Props) => (
  <div className={className}>
    {hovering && (
      <Container>
        {onEdit && (
          <Tooltip title="Edit">
            <Icon onClick={handleClick(onEdit)}>
              <EditIcon />
            </Icon>
          </Tooltip>
        )}
        {onCreateFile && (
          <Tooltip title="New File">
            <Icon onClick={handleClick(onCreateFile)}>
              <AddFileIcon />
            </Icon>
          </Tooltip>
        )}
        {onCreateDirectory && (
          <Tooltip title="New Directory">
            <Icon onClick={handleClick(onCreateDirectory)}>
              <AddDirectoryIcon />
            </Icon>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <Icon onClick={handleClick(onDelete)}>
              <CrossIcon />
            </Icon>
          </Tooltip>
        )}
      </Container>
    )}
  </div>
);
