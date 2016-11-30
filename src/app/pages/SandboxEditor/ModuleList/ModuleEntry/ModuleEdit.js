// @flow
import React from 'react';
import styled from 'styled-components';

import commonStyles from './styles';
import type { Module } from '../../../../store/entities/modules';
import ModuleIcons from './ModuleIcons';
import ModuleTitleInput from './ModuleTitleInput';

const ModuleContainer = styled.span`${props => commonStyles(props)}`;

type Props = {
  module: Module;
  isActive: boolean;
  depth: number;
  onChange: (name: string) => void;
  onCommit: (name: string) => void;
  onCancel: () => void;
};


export default ({ isActive, depth, module, onChange, onCancel, onCommit }: Props) => (
  <ModuleContainer
    active={isActive}
    depth={depth}
    nameValidationError={module.edits && module.edits.error}
    editing
  >
    <ModuleIcons type={module.type} />
    <ModuleTitleInput
      title={module.edits ? module.edits.title : module.title}
      onChange={onChange}
      onCancel={onCancel}
      onCommit={onCommit}
    />
  </ModuleContainer>
);
