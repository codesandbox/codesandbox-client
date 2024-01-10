import React from 'react';

import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';
import AddFileIcon from 'react-icons/lib/md/insert-drive-file';
import AddDirectoryIcon from 'react-icons/lib/md/create-new-folder';
import UploadFileIcon from 'react-icons/lib/md/file-upload';
import DownloadIcon from 'react-icons/lib/md/file-download';
import UndoIcon from 'react-icons/lib/md/undo';

import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';

import { Icon } from '../../../../elements';
import { Container } from './elements';

const handleClick = func => e => {
  e.preventDefault();
  e.stopPropagation();
  func();
};

export function EditIcons({
  className = undefined,
  hovering,
  onDelete,
  onDiscardChanges,
  onEdit,
  onCreateFile,
  onCreateDirectory,
  active,
  onUploadFile,
  onDownload = undefined,
  forceShow,
}) {
  // Phones need double click if we show elements on click, that's why we only want
  // to show these edit icons when the user clicks and hasn't activated the module
  if (window.__isTouch && !active && !forceShow) {
    return null;
  }

  return (
    <div className={className}>
      {(hovering || (window.__isTouch && active) || forceShow) && (
        <Container>
          <SingletonTooltip>
            {singleton => (
              <>
                {onDownload && (
                  <Tooltip content="Export to ZIP" singleton={singleton}>
                    <Icon onClick={handleClick(onDownload)}>
                      <DownloadIcon />
                    </Icon>
                  </Tooltip>
                )}
                {onUploadFile && (
                  <Tooltip content="Upload Files" singleton={singleton}>
                    <Icon onClick={handleClick(onUploadFile)}>
                      <UploadFileIcon />
                    </Icon>
                  </Tooltip>
                )}
                {onDiscardChanges && (
                  <Tooltip content="Discard Changes">
                    <Icon onClick={handleClick(onDiscardChanges)}>
                      <UndoIcon />
                    </Icon>
                  </Tooltip>
                )}
                {onEdit && (
                  <Tooltip content="Rename" singleton={singleton}>
                    <Icon onClick={handleClick(onEdit)}>
                      <EditIcon />
                    </Icon>
                  </Tooltip>
                )}
                {onCreateFile && (
                  <Tooltip content="New File" singleton={singleton}>
                    <Icon onClick={handleClick(onCreateFile)}>
                      <AddFileIcon />
                    </Icon>
                  </Tooltip>
                )}
                {onCreateDirectory && (
                  <Tooltip content="New Directory" singleton={singleton}>
                    <Icon onClick={handleClick(onCreateDirectory)}>
                      <AddDirectoryIcon />
                    </Icon>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip content="Delete" singleton={singleton}>
                    <Icon onClick={handleClick(onDelete)}>
                      <CrossIcon />
                    </Icon>
                  </Tooltip>
                )}
              </>
            )}
          </SingletonTooltip>
        </Container>
      )}
    </div>
  );
}
