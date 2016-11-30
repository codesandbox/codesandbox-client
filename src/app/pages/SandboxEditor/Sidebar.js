// @flow
import React from 'react';
import styled from 'styled-components';
import { values } from 'lodash';

import SandboxModuleList from './SandboxModuleList';

import type { Module } from '../../store/entities/modules/';
import type { Sandbox } from '../../store/entities/sandboxes/';

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

type Props = {
  modules: Array<Module>;
  activeModuleId: string;
  renameModule: (id: string, title: string) => void;
  url: (module: Module) => string;
  sandbox: ?Sandbox;
}
export default ({ sandbox, modules, renameModule, activeModuleId, url }: Props) => (
  <Container>
    <Title>{sandbox ? sandbox.title : 'Loading...'}</Title>
    {sandbox &&
      <SandboxModuleList
        module={modules.find(x => x.mainModule)}
        modules={modules}
        activeModuleId={activeModuleId}
        url={url}
        depth={0}
        renameModule={renameModule}
      />}
  </Container>
);
