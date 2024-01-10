import React from 'react';

import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import {
  CrossIcon,
  EditIcon,
  AddFileIcon,
  AddDirectoryIcon,
  UploadFileIcon,
  DownloadIcon,
  UndoIcon,
  // eslint-disable-next-line import/extensions
} from '../../../icons.tsx';
import { ErrorBoundary } from './ErrorBoundary';

import { Container, Icon } from './elements';

const handleClick = func => e => {
  e.preventDefault();
  e.stopPropagation();
  func();
};

function EditIcons({
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
      <ErrorBoundary>
        {hovering || (window.__isTouch && active) || forceShow ? (
          <SingletonTooltip>
            {singleton => (
              <Container>
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
              </Container>
            )}
          </SingletonTooltip>
        ) : null}
      </ErrorBoundary>
    </div>
  );
}

export default EditIcons;
