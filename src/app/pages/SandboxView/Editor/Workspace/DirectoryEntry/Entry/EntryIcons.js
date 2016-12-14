import React from 'react';
import styled from 'styled-components';

// import ModuleIcon from 'react-icons/lib/fa/file-o';
import FunctionIcon from 'react-icons/lib/fa/code';
import FolderIcon from 'react-icons/lib/md/keyboard-arrow-down';
import DirectoryIcon from 'react-icons/lib/go/file-directory';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';
import ReactIcon from '../../../../../../components/ReactIcon';

const NotSyncedIconWithMargin = styled(NotSyncedIcon)`
  margin-left: -20px;
  margin-right: 6px;
  color: ${props => props.theme.secondary};
`;

const StyledFolderIcon = styled.span`
  svg {
    transition: 0.3s ease transform;
    margin-left: -20px;
    margin-right: 6px;

    transform: rotateZ(${props => (props.isOpen ? '0deg' : '-90deg')});
  }
`;

const getIcon = (type) => {
  if (type === 'react') {
    return <ReactIcon />;
  }
  if (type === 'function') {
    return <FunctionIcon />;
  }
  if (type === 'directory') {
    return <DirectoryIcon />;
  }
  return <FunctionIcon />;
};

type Props = {
  type: string;
  hasChildren: boolean;
  isNotSynced: ?boolean;
  isOpen?: boolean;
  onOpen: () => void;
};
export default ({ type, hasChildren, isNotSynced, isOpen, onOpen }: Props) => (
  <span>
    {isNotSynced && <NotSyncedIconWithMargin />}
    {type === 'directory' && hasChildren && (
      <StyledFolderIcon isOpen={isOpen} onClick={onOpen}>
        <FolderIcon />
      </StyledFolderIcon>
    )}
    {getIcon(type)}
  </span>
);
