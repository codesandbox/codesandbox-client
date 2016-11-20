// @flow
import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router';

import type { Module } from '../../store/entities/modules/';

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 120px;
  background-color: #0E1E27;
  color: #E0E0E0;
`;

const ModuleLink = styled(Link)`
  display: block;
  padding: 1rem 0;
  color: white;
  text-decoration: none;
  text-align: center;
`;

type Props = {
  modules: Array<Module>;
  activeModule: number;
  url: (module: Module) => string;
}
export default ({ modules, activeModule, url }: Props) => (
  <Container>
    {modules.map(module => (
      <ModuleLink
        activeStyle={{ backgroundColor: '#1B2B34' }}
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
