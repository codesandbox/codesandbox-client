import React from 'react';
import styled from 'styled-components';

import CrossIcon from 'react-icons/lib/md/clear';
import EditIcon from 'react-icons/lib/go/pencil';
import AddFileIcon from 'react-icons/lib/go/file-symlink-file';
import AddDirectoryIcon from 'react-icons/lib/go/file-symlink-directory';

import fadeIn from 'app/utils/animation/fade-in';

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
  ${fadeIn(0)}

  vertical-align: middle;
  line-height: 1;
`;

const Icon = styled.div`
  transition: 0.3s ease color;
  color: ${props => props.theme.background2.lighten(3)};
  padding-left: 0.25rem;
  &:hover {
    color: white;
  }
`;

const handleClick = func => (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  func();
};

export default (
  {
    className,
    hovering,
    onDelete,
    onEdit,
    onCreateFile,
    onCreateDirectory,
  }: Props
) => (
  <div className={className}>
    {hovering &&
      <Container>
        {onEdit && <Icon onClick={handleClick(onEdit)}><EditIcon /></Icon>}
        {onCreateFile &&
          <Icon onClick={handleClick(onCreateFile)}><AddFileIcon /></Icon>}
        {onCreateDirectory &&
          <Icon onClick={handleClick(onCreateDirectory)}>
            <AddDirectoryIcon />
          </Icon>}
        {onDelete && <Icon onClick={handleClick(onDelete)}><CrossIcon /></Icon>}
      </Container>}
  </div>
);
