// @flow
import React from 'react';
import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { Sandbox } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import {
  modulesFromSandboxNotSavedSelector,
} from 'app/store/entities/sandboxes/modules/selectors';

import Files from './Files';
import Versions from './Versions';
import Dependencies from './Dependencies';
import Project from './Project';
import WorkspaceItem from './WorkspaceItem';
import SandboxDetails from './SandboxDetails';
import Preferences from './Preferences';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  preventTransition: boolean,
};

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});
const mapStateToProps = createSelector(
  modulesFromSandboxNotSavedSelector,
  preventTransition => ({ preventTransition }),
);
const Workspace = ({ sandbox, preventTransition, sandboxActions }: Props) => (
  <Container>
    <SandboxDetails
      sandbox={sandbox}
      updateSandboxInfo={sandboxActions.updateSandboxInfo}
    />
    <WorkspaceItem defaultOpen title="Project">
      <Project
        updateSandboxInfo={sandboxActions.updateSandboxInfo}
        id={sandbox.id}
        title={sandbox.title}
        viewCount={sandbox.viewCount}
        description={sandbox.description}
        forkedSandbox={sandbox.forkedFromSandbox}
        preventTransition={preventTransition}
        owned={sandbox.owned}
        deleteSandbox={sandboxActions.deleteSandbox}
      />
    </WorkspaceItem>

    <WorkspaceItem defaultOpen title="Files">
      <Files sandbox={sandbox} sandboxActions={sandboxActions} />
    </WorkspaceItem>

    <WorkspaceItem title="Dependencies">
      <Dependencies
        sandboxId={sandbox.id}
        npmDependencies={sandbox.npmDependencies}
        externalResources={sandbox.externalResources}
        sandboxActions={sandboxActions}
        processing={
          !!(sandbox.dependencyBundle && sandbox.dependencyBundle.processing)
        }
      />
    </WorkspaceItem>

    <WorkspaceItem
      disabled="It will be possible to publish sandboxes soon (tm)"
      title="Publishing"
    >
      <Versions />
    </WorkspaceItem>

    <WorkspaceItem title="Preferences">
      <Preferences />
    </WorkspaceItem>
  </Container>
);
export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
