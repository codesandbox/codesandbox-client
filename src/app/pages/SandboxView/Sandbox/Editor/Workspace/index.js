// @flow
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { Sandbox } from '../../../../../store/entities/sandboxes/entity';
import sandboxActionCreators
  from '../../../../../store/entities/sandboxes/actions';

import Files from './Files';
// import Versions from './Versions';
import Dependencies from './Dependencies';
import Summary from './Summary';
import WorkspaceItem from './WorkspaceItem';
import SandboxDetails from './SandboxDetails';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
};

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});
const Workspace = ({ sandbox, sandboxActions }: Props) => (
  <Container>
    <SandboxDetails sandbox={sandbox} />
    <WorkspaceItem defaultOpen title="Project">
      <Summary sandbox={sandbox} />
    </WorkspaceItem>

    <WorkspaceItem defaultOpen title="Files">
      <Files sandbox={sandbox} sandboxActions={sandboxActions} />
    </WorkspaceItem>

    <WorkspaceItem title="Dependencies">
      <Dependencies
        sandboxId={sandbox.id}
        npmDependencies={sandbox.npmDependencies}
        sandboxActions={sandboxActions}
        processing={
          sandbox.dependencyBundle && sandbox.dependencyBundle.processing
        }
      />
    </WorkspaceItem>
  </Container>
);
export default connect(null, mapDispatchToProps)(Workspace);
// <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />;
