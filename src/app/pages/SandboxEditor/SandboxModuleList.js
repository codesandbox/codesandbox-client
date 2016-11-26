// @flow
import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router';

import type { Sandbox } from '../../store/entities/sandboxes/';
import type { Module } from '../../store/entities/modules/';
import theme from '../../../common/theme';

import ModuleIcon from './ModuleIcon';

const ChildContainer = styled.div`
  margin-left: ${props => (props.child ? `${1}rem` : 0)};
`;

const ModuleLink = styled(Link)`
  transition: 0.3s ease all;
  display: block;
  font-size: 14px;
  padding: 0.6rem;
  margin-left: 1.5rem;
  color: ${props => props.theme.background.lighten(2)};
  text-decoration: none;
  font-weight: 400;
  min-width: 100px;
  border-right: 2px solid transparent;

  &:hover {
    color: ${props => props.theme.background.lighten(5)};
    border-color: ${props => props.theme.primary.darken(0.4)};
  }
`;

const activeStyle = {
  color: '#E0E0E0',
  borderColor: theme.primary(),
};

type Props = {
  child?: boolean;
  sandbox: Sandbox;
  modules: { [id: string]: Module };
  activeModuleId: string;
  url: (module: Module) => string;
}

export default ({ child, sandbox, modules, activeModuleId, url }: Props) => (
  <ChildContainer child={child}>
    <ModuleLink
      activeStyle={activeStyle}
      isActive={() => modules[sandbox.mainModule].id === activeModuleId}
      to={url(modules[sandbox.mainModule])}
      key={modules[sandbox.mainModule].id}
    >
      <ModuleIcon type="project" /> {sandbox.title}
    </ModuleLink>
    {sandbox.modules.map((moduleId) => {
      const module = modules[moduleId];
      return (
        <ChildContainer child>
          <ModuleLink
            activeStyle={activeStyle}
            isActive={() => module.id === activeModuleId}
            to={url(module)}
            key={module.id}
          >
            <ModuleIcon type={module.type} /> {module.name}
          </ModuleLink>
        </ChildContainer>
      );
    })}
  </ChildContainer>
);
