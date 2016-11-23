/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { singleSandboxSelector } from '../../store/entities/sandboxes/selector';
import type { Sandbox } from '../../store/entities/sandboxes/';
import { modulesSelector } from '../../store/entities/modules/selector';
import type { Module } from '../../store/entities/modules/';
import { editModuleUrl } from '../../utils/url-generator';

import Editor from './Editor';
import ModuleList from './ModuleList';

type Props = {
  sandbox: Sandbox,
  modules: { [id: string]: Module },
  params: {
    sandbox: string,
    module: string, // eslint-disable-line react/no-unused-prop-types
  },
};

const Container = styled.div`
  display: flex;
`;

const mapStateToProps = (state, props: Props) => ({
  sandbox: singleSandboxSelector(state, { id: props.params.sandbox }),
  modules: modulesSelector(state),
});

const SandboxEditor = ({ params, sandbox, modules }: Props) => {
  const moduleId = params.module === 'undefined' ? sandbox.modules[0] : params.module;
  return (
    <Container>
      <ModuleList
        activeModule={moduleId}
        modules={sandbox.modules.map(id => modules[id])}
        url={module => editModuleUrl(sandbox, module)}
      />
      <Editor moduleId={moduleId} />
    </Container>
  );
};
export default connect(mapStateToProps)(SandboxEditor);
