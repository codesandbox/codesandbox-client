import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/es/components/Tooltip';
import React from 'react';
import { GoPencil } from 'react-icons/go';
import {
  MdClear,
  MdCreateNewFolder,
  MdFileDownload,
  MdFileUpload,
  MdInsertDriveFile,
  MdUndo,
} from 'react-icons/md';

import { Icon } from '../../../../elements';
import { Container } from './elements';

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
      {(hovering || (window.__isTouch && active) || forceShow) && (
        <Container>
          <SingletonTooltip>
            {singleton => (
              <>
                {onDownload && (
                  <Tooltip content="Export to ZIP" singleton={singleton}>
                    <Icon onClick={handleClick(onDownload)}>
                      <MdFileDownload />
                    </Icon>
                  </Tooltip>
                )}
                {onUploadFile && (
                  <Tooltip content="Upload Files" singleton={singleton}>
                    <Icon onClick={handleClick(onUploadFile)}>
                      <MdFileUpload />
                    </Icon>
                  </Tooltip>
                )}
                {onDiscardChanges && (
                  <Tooltip content="Discard Changes">
                    <Icon onClick={handleClick(onDiscardChanges)}>
                      <MdUndo />
                    </Icon>
                  </Tooltip>
                )}
                {onEdit && (
                  <Tooltip content="Rename" singleton={singleton}>
                    <Icon onClick={handleClick(onEdit)}>
                      <GoPencil />
                    </Icon>
                  </Tooltip>
                )}
                {onCreateFile && (
                  <Tooltip content="New File" singleton={singleton}>
                    <Icon onClick={handleClick(onCreateFile)}>
                      <MdInsertDriveFile />
                    </Icon>
                  </Tooltip>
                )}
                {onCreateDirectory && (
                  <Tooltip content="New Directory" singleton={singleton}>
                    <Icon onClick={handleClick(onCreateDirectory)}>
                      <MdCreateNewFolder />
                    </Icon>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip content="Delete" singleton={singleton}>
                    <Icon onClick={handleClick(onDelete)}>
                      <MdClear />
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

export default EditIcons;
