// @flow
import React from 'react';
import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Sandbox, User } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import { modulesFromSandboxNotSavedSelector } from 'app/store/entities/sandboxes/modules/selectors';
import { usersSelector } from 'app/store/entities/users/selectors';
import { isPatronSelector } from 'app/store/user/selectors';

import showAlternativeComponent from 'app/hoc/show-alternative-component';
import fadeIn from 'app/utils/animation/fade-in';
import { tosUrl, privacyUrl } from 'app/utils/url-generator';

import Files from './Files';
import Dependencies from './Dependencies';
import Project from './Project';
import Tags from './Tags';
import WorkspaceItem from './WorkspaceItem';
import SandboxActions from './SandboxActions';
import Logo from './Logo';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
  overflow-y: overlay;

  > div {
    ${fadeIn(0)};
  }
`;

const TermsContainer = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  padding: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: .875rem;
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  preventTransition: boolean,
  user: User,
  isPatron: boolean,
};

const mapStateToProps = createSelector(
  modulesFromSandboxNotSavedSelector,
  usersSelector,
  (_, props) => props.sandbox && props.sandbox.author,
  isPatronSelector,
  (preventTransition, users, author, isPatron) => ({
    preventTransition,
    user: users[author],
    isPatron,
  }),
);

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});

const Workspace = ({
  sandbox,
  user,
  preventTransition,
  sandboxActions,
  isPatron,
}: Props) =>
  <Container>
    <div>
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
          privacy={sandbox.privacy}
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

      {(sandbox.owned || sandbox.tags.length > 0) &&
        <WorkspaceItem title="Tags">
          <Tags
            sandboxId={sandbox.id}
            addTag={sandboxActions.addTag}
            removeTag={sandboxActions.removeTag}
            isOwner={sandbox.owned}
            tags={sandbox.tags}
          />
        </WorkspaceItem>}

      {sandbox.owned &&
        <WorkspaceItem title="Sandbox Actions">
          <SandboxActions
            id={sandbox.id}
            deleteSandbox={sandboxActions.deleteSandbox}
            newSandboxUrl={sandboxActions.newSandboxUrl}
            setSandboxPrivacy={sandboxActions.setSandboxPrivacy}
            isPatron={isPatron}
            privacy={sandbox.privacy}
          />
        </WorkspaceItem>}
    </div>

    <TermsContainer>
      By using CodeSandbox you agree to our{' '}
      <Link to={tosUrl()}>Terms and Conditions</Link> and{' '}
      <Link to={privacyUrl()}>Privacy Policy</Link>.
    </TermsContainer>
  </Container>;

// The skeleton to show if sandbox doesn't exist
const Skeleton = () => <Container />;

export default showAlternativeComponent(Skeleton, ['sandbox'])(
  connect(mapStateToProps, mapDispatchToProps)(Workspace),
);
