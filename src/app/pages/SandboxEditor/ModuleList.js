// @flow
import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router';

import type { Module } from '../../store/entities/modules/';

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: #0E1E27;
  color: #E0E0E0;
`;

const ModuleLink = styled(Link)`
  transition: 0.3s ease all;
  display: inline-block;
  font-size: 14px;
  padding: 0.6rem 0;
  padding-top: calc(0.6rem + 2px);
  margin: 0 0.5rem;
  color: #76858E;
  text-decoration: none;
  font-weight: 200;
  text-align: center;
  min-width: 100px;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #A8C3D2;
    border-color: #2C55AD;
  }
`;

const activeStyle = {
  color: 'white',
  borderColor: '#749CF2',
};

type Props = {
  modules: Array<Module>;
  activeModule: string;
  url: (module: Module) => string;
}
export default ({ modules, activeModule, url }: Props) => (
  <Container>
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
