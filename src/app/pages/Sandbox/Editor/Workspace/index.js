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

import Tooltip from 'app/components/Tooltip';

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
  isInProjectView: boolean,
  toggleFileEval: Function
};

const mapStateToProps = createSelector(
  modulesFromSandboxNotSavedSelector,
  usersSelector,
  (_, props) => props.sandbox && props.sandbox.author,
  (_, props) => props.sandbox && props.sandbox.isInProjectView,
  (preventTransition, users, author, isInProjectView) => ({
    preventTransition,
    user: users[author],
    isInProjectView
  }),
);

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});

const mergeProps = (stateProps, { sandboxActions }, props) => ({
  ...stateProps,
  ...props,
  sandboxActions,
  toggleFileEval: e => {
    e.stopPropagation()
    const { setProjectView } = sandboxActions;
    setProjectView(props.sandbox.id, !stateProps.isInProjectView);
  }
});


const Workspace = ({
  sandbox,
  user,
  preventTransition,
  sandboxActions,
  isInProjectView,
  toggleFileEval,
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
        deleteSandbox={sandboxActions.deleteSandbox}
      />
    </WorkspaceItem>

    <WorkspaceItem
      defaultOpen
      title="Files"
      custom={
        <FileEvalSwitch 
          isInProjectView={isInProjectView}
          toggleFileEval={toggleFileEval} 
        />
      }
    >
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
        />
      </WorkspaceItem>}

    <WorkspaceItem title="Preferences">
      <Preferences />
    </WorkspaceItem>
  </Container>;

// The skeleton to show if sandbox doesn't exist
const Skeleton = () => <Container />;

export default showAlternativeComponent(Skeleton, ['sandbox'])(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(Workspace),
);

const FileContainer = styled.div`
  margin-left: auto;
  margin-right: 20px;
`;

const FileEvalCheckbox = styled.input`
  transform: scale(.8);
`
const FileEvalLabel = styled.label`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
`

const FileEvalSwitch = ({
  isInProjectView,
  toggleFileEval,
}: {
  isInProjectView: boolean,
  toggleFileEval: Function,
}) =>
  console.log('IS PROJ VIEW', isInProjectView) || <FileContainer>
    <Tooltip
      title="Eval mode allows you to re-evaluate each file as you click it. It's great for galleries."
      position="right"
    >
      <FileEvalCheckbox
        id='fileEval'
        type='checkbox'
        checked={!isInProjectView}
        onClick={toggleFileEval}
      />
      <FileEvalLabel
        htmlFor='fileEval'
        onClick={e => e.stopPropagation()}
      > File eval
      </FileEvalLabel>
    </Tooltip>
  </FileContainer>

