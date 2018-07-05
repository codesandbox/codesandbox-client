import React from 'react';

import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';
import AddFileIcon from 'react-icons/lib/md/insert-drive-file';
import AddDirectoryIcon from 'react-icons/lib/md/create-new-folder';
import UploadFileIcon from 'react-icons/lib/md/file-upload';

import Tooltip from 'common/components/Tooltip';

import { Icon } from '../../../../elements';
import { Container } from './elements';

const handleClick = func => e => {
  e.preventDefault();
  e.stopPropagation();
  func();
};

function EditIcons({
  className,
  onDelete,
  onEdit,
  onCreateFile,
  onCreateDirectory,
  active,
  onUploadFile,
  forceShow,
}) {
  // Phones need double click if we show elements on click, that's why we only want
  // to show these edit icons when the user clicks and hasn't activated the module
  if (window.__isTouch && !active && !forceShow) {
    return null;
  }

  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Container>
        {onEdit && (
          <Tooltip title="Rename">
            <Icon onClick={handleClick(onEdit)}>
              <EditIcon style={{ pointerEvents: 'auto' }} />
            </Icon>
          </Tooltip>
        )}
        {onUploadFile && (
          <Tooltip title="Upload Files">
            <Icon onClick={handleClick(onUploadFile)}>
              <UploadFileIcon style={{ pointerEvents: 'auto' }} />
            </Icon>
          </Tooltip>
        )}
        {onCreateFile && (
          <Tooltip title="New File">
            <Icon onClick={handleClick(onCreateFile)}>
              <AddFileIcon style={{ pointerEvents: 'auto' }} />
            </Icon>
          </Tooltip>
        )}
        {onCreateDirectory && (
          <Tooltip title="New Directory">
            <Icon onClick={handleClick(onCreateDirectory)}>
              <AddDirectoryIcon style={{ pointerEvents: 'auto' }} />
            </Icon>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <Icon onClick={handleClick(onDelete)}>
              <CrossIcon style={{ pointerEvents: 'auto' }} />
            </Icon>
          </Tooltip>
        )}
      </Container>
    </div>
  );
}

export default EditIcons;
