// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import FolderIcon from 'react-icons/lib/md/keyboard-arrow-down';

import type { Module } from '../../../store/entities/modules/';
import ModuleIcon from './ModuleIcon';
import theme from '../../../../common/theme';

const ModuleLink = styled(Link)`
  transition: 0.3s ease all;
  position: relative;
  display: block;
  font-size: 14px;
  padding: 0.6rem;
  padding-left: ${props => props.depth + 2.9}rem;
  color: ${props => props.theme.background.lighten(2)};
  text-decoration: none;
  font-weight: 400;
  min-width: 100px;
  border-right: 2px solid transparent;

  &:hover {
    background-color: ${props => props.theme.lightBackground.darken(0.2)};
    color: ${props => props.theme.background.lighten(5)};
    border-color: ${props => props.theme.primary.darken(0.4)};
  }
`;

const StyledFolderIcon = styled(FolderIcon)`
  transition: 0.3s ease transform;
  margin-left: -16px;
  margin-right: 8px;

  transform: rotateZ(${props => (props.isOpen ? '0deg' : '-90deg')});
`;

const activeStyle = {
  color: '#E0E0E0',
  borderColor: theme.primary(),
  backgroundColor: theme.lightBackground(),
};

type Props = {
  module: Module;
  title: string;
  url: (module: Module) => string;
  isActive: boolean;
  isProject?: boolean;
  depth: number;
  toggleOpen?: (event: Event) => void;
  isOpen?: boolean;
};

export default ({ module, title, url, isActive, isProject, isOpen, depth, toggleOpen }: Props) => (
  <ModuleLink
    to={url(module)}
    isActive={() => isActive}
    activeStyle={activeStyle}
    depth={depth}
  >
    {isProject && <StyledFolderIcon isOpen={isOpen} onClick={toggleOpen} />}
    <ModuleIcon type={isProject ? 'project' : module.type} />
    {title}
  </ModuleLink>
);

