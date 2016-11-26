// @flow
import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router';

import type { Module } from '../../store/entities/modules/';
import type { Sandbox } from '../../store/entities/sandboxes/';
import theme from '../../../common/theme';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  width: 20rem;
`;

const Title = styled.h2`
  padding: 1rem;
  margin: 0 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 300;

  border-bottom: 1px solid ${props => props.theme.background.lighten(0.5)};
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
    border-right-color: ${props => props.theme.primary.darken(0.4)};
  }
`;

const activeStyle = {
  color: '#E0E0E0',
  borderRightColor: theme.primary(),
};

type Props = {
  modules: Array<Module>;
  activeModule: string;
  url: (module: Module) => string;
  sandbox: Sandbox;
}
export default ({ sandbox, modules, activeModule, url }: Props) => (
  <Container>
    <Title>{sandbox.title}</Title>
    {modules.map(module => (
      <ModuleLink
        activeStyle={activeStyle}
        isActive={() => module.id === activeModule}
        to={url(module)}
        key={module.id}
      >
        {module.name}
      </ModuleLink>
    ),
    )}
  </Container>
);
