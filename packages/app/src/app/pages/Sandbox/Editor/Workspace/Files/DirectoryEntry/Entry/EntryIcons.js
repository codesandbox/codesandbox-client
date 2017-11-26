import React from 'react';
import styled from 'styled-components';

import ProjectIcon from 'react-icons/lib/go/file-code';
import FunctionIcon from 'react-icons/lib/fa/code';
import DirectoryIcon from 'react-icons/lib/md/folder';
import DirectoryOpenIcon from 'react-icons/lib/md/folder-open';
import CSSIcon from 'react-icons/lib/fa/css3';
import HTMLIcon from 'react-icons/lib/fa/html5';
import ErrorIcon from 'react-icons/lib/md/error';
import RawIcon from 'react-icons/lib/go/file-text';
import ReactIcon from 'app/components/ReactIcon';
import TypeScriptIcon from 'app/components/TypeScriptIcon';

const RedIcon = styled.span`
  color: ${props => props.theme.red};
`;

const getIcon = (type, error, root, open) => {
  if (root) {
    return <ProjectIcon />;
  }
  if (error) {
    return (
      <RedIcon>
        <ErrorIcon />
      </RedIcon>
    );
  }

  switch (type) {
    case 'react':
      return <ReactIcon />;
    case 'js':
    case 'json':
    case 'function':
      return <FunctionIcon />;
    case 'directory':
      return open ? <DirectoryOpenIcon /> : <DirectoryIcon />;
    case 'css':
      return <CSSIcon />;
    case 'ts':
      return <TypeScriptIcon />;
    case 'html':
      return <HTMLIcon />;
    default:
      return <RawIcon />;
  }
};

type Props = {
  type: string,
  isOpen?: boolean,
  root: ?boolean,
  error: boolean,
};
export default function EntryIcon({ type, root, error, isOpen }: Props) {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {getIcon(type, error, root, isOpen)}
    </div>
  );
}

EntryIcon.defaultProps = {
  isOpen: false,
};
