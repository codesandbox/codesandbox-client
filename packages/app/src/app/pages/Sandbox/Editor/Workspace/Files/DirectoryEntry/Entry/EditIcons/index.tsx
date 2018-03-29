import * as React from 'react';

import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';
import AddFileIcon from 'react-icons/lib/md/insert-drive-file';
import AddDirectoryIcon from 'react-icons/lib/md/create-new-folder';

import Tooltip from 'common/components/Tooltip';

import { Icon } from '../../../../elements';
import { Container } from './elements';

const handleClick = func => e => {
  e.preventDefault();
  e.stopPropagation();
  func();
};

type Props = {
  className?: string
  hovering: boolean
  onDelete: () => void
  onEdit: () => void
  onCreateFile: () => void
  onCreateDirectory: () => void
}

const EditIcons: React.SFC<Props> = ({
  className,
  hovering,
  onDelete,
  onEdit,
  onCreateFile,
  onCreateDirectory,
<<<<<<< HEAD:packages/app/src/app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EditIcons/index.js
  active,
  forceShow,
}) {
  // Phones need double click if we show elements on click, that's why we only want
  // to show these edit icons when the user clicks and hasn't activated the module
  if (window.__isTouch && !active && !forceShow) {
    return null;
  }

=======
}) => {
>>>>>>> refactored sandbox:packages/app/src/app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EditIcons/index.tsx
  return (
    <div className={className}>
      {(hovering || (window.__isTouch && active) || forceShow) && (
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
}

export default EditIcons;
