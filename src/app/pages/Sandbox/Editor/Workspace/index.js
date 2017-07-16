// @flow
import React from 'react';
import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { Sandbox, User } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import { modulesFromSandboxNotSavedSelector } from 'app/store/entities/sandboxes/modules/selectors';
import { usersSelector } from 'app/store/entities/users/selectors';

import showAlternativeComponent from 'app/hoc/show-alternative-component';
import fadeIn from 'app/utils/animation/fade-in';

import Files from './Files';
import Dependencies from './Dependencies';
import Project from './Project';
import WorkspaceItem from './WorkspaceItem';
import SandboxActions from './SandboxActions';
import Logo from './Logo';
import Preferences from './Preferences';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
  overflow-y: overlay;

  > div {
    ${fadeIn(0)};
  }
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  preventTransition: boolean,
  user: User,
};

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});
const mapStateToProps = createSelector(
  modulesFromSandboxNotSavedSelector,
  usersSelector,
  (_, props) => props.sandbox && props.sandbox.author,
  (preventTransition, users, author) => ({
    preventTransition,
    user: users[author],
  }),
);
const Workspace = ({
  sandbox,
  user,
  preventTransition,
  sandboxActions,
}: Props) =>
  <Container>
    <Logo />
    <WorkspaceItem defaultOpen title="Project">
      <Project
        updateSandboxInfo={sandboxActions.updateSandboxInfo}
        id={sandbox.id}
        title={sandbox.title}
        viewCount={sandbox.viewCount}
        likeCount={sandbox.likeCount}
        forkCount={sandbox.forkCount}
        git={sandbox.git}
        description={sandbox.description}
        forkedSandbox={sandbox.forkedFromSandbox}
        preventTransition={preventTransition}
        owned={sandbox.owned}
        author={user}
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

    {sandbox.owned &&
      <WorkspaceItem title="Sandbox Actions">
        <SandboxActions
          id={sandbox.id}
          deleteSandbox={sandboxActions.deleteSandbox}
          newSandboxUrl={sandboxActions.newSandboxUrl}
        />
      </WorkspaceItem>}

    <WorkspaceItem title="Preferences">
      <Preferences />
    </WorkspaceItem>
  </Container>;

// The skeleton to show if sandbox doesn't exist
const Skeleton = () => <Container />;

export default showAlternativeComponent(Skeleton, ['sandbox'])(
  connect(mapStateToProps, mapDispatchToProps)(Workspace),
);
