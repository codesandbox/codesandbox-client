/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { singleSandboxSelector, sandboxesSelector } from '../../store/entities/sandboxes/selector';
import type { Sandbox } from '../../store/entities/sandboxes/';
import { modulesSelector } from '../../store/entities/modules/selector';
import type { Module } from '../../store/entities/modules/';
import { editModuleUrl } from '../../utils/url-generator';

import Editor from './Editor';
import Sidebar from './Sidebar';

type Props = {
  sandbox: Sandbox,
  sandboxes: { [id: string]: Sandbox },
  modules: { [id: string]: Module },
  params: {
    sandbox: string,
    module: string, // eslint-disable-line react/no-unused-prop-types
  },
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex: auto;
`;

const mapStateToProps = (state, props: Props) => ({
  sandbox: singleSandboxSelector(state, { id: props.params.sandbox }),
  sandboxes: sandboxesSelector(state),
  modules: modulesSelector(state),
});

const SandboxEditor = ({ params, sandbox, sandboxes, modules }: Props) => {
  const moduleId = params.module === 'undefined' ? sandbox.modules[0] : params.module;
  return (
    <Container>
      <Sidebar
        activeModuleId={moduleId}
        sandbox={sandbox}
        sandboxes={sandboxes}
        modules={modules}
        url={module => editModuleUrl(sandbox, module)}
      />
      <Editor moduleId={moduleId} />
    </Container>
  );
};
export default connect(mapStateToProps)(SandboxEditor);
