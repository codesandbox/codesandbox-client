// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import commonStyles from './styles';
import type { Module } from '../../../../store/entities/modules/';
import ModuleIcons from './ModuleIcons';
import ModuleTitle from './ModuleTitle';
import ModuleActions from './ModuleActions';

const ModuleLink = styled(Link)`${props => commonStyles(props)}`;

type Props = {
  module: Module;
  url: (module: Module) => string;
  isActive: boolean;
  depth: number;
  hasChildren: boolean;
  toggleOpen?: (event: Event) => void;
  onEditClick: (e: Event) => void;
  onCreateClick: (e: Event) => void;
};

export default ({
  module, url, isActive, depth, hasChildren,
  toggleOpen, onEditClick, onCreateClick }: Props,
) => (
  <ModuleLink
    to={url(module)}
    active={isActive}
    depth={depth}
  >
    <ModuleIcons
      type={module.type}
      hasChildren={hasChildren}
      isOpen={module.isTreeOpen}
      onOpen={toggleOpen}
    />
    <ModuleTitle title={module.title} />
    <ModuleActions
      onEditClick={onEditClick}
      onCreateClick={onCreateClick}
    />
  </ModuleLink>
);
