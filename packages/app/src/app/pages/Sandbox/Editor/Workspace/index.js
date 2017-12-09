// @flow
import * as React from 'react';
import { createSelector } from 'reselect';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import type { Sandbox, User, CurrentUser } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import modalActionCreators from 'app/store/modal/actions';
import { modulesFromSandboxNotSavedSelector } from 'app/store/entities/sandboxes/modules/selectors';
import { usersSelector } from 'app/store/entities/users/selectors';
import {
  currentUserSelector,
  isPatronSelector,
} from 'app/store/user/selectors';
import getTemplateDefinition from 'common/templates';

import showAlternativeComponent from 'app/hoc/show-alternative-component';
import fadeIn from 'common/utils/animation/fade-in';
import { tosUrl, privacyUrl } from 'common/utils/url-generator';

import Button from 'app/components/buttons/Button';
import Margin from 'common/components/spacing/Margin';

import WorkspaceInputContainer from './WorkspaceInputContainer';
import Files from './Files';
import Dependencies from './Dependencies';
import Project from './Project';
import Tags from './Tags';
import WorkspaceItem from './WorkspaceItem';
import SandboxActions from './SandboxActions';
import Logo from './Logo';
import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';
import Git from './Git';
import CreateRepo from './Git/CreateRepo';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow-y: overlay;
  overflow-x: auto;

  > div {
    ${fadeIn(0)};
  }
`;

const TermsContainer = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  padding: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  modalActions: typeof modalActionCreators,
  preventTransition: boolean,
  user: User,
  currentUser: CurrentUser,
  isPatron: boolean,
  zenMode: boolean,
};

const mapStateToProps = createSelector(
  modulesFromSandboxNotSavedSelector,
  usersSelector,
  (_, props) => props.sandbox && props.sandbox.author,
  isPatronSelector,
  currentUserSelector,
  (preventTransition, users, author, isPatron, currentUser) => ({
    preventTransition,
    user: users[author],
    isPatron,
    currentUser,
  })
);

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});

class Workspace extends React.PureComponent<Props> {
  openPreferences = () => {
    this.props.modalActions.openPreferences('Integrations');
  };

  render() {
    const {
      sandbox,
      user,
      preventTransition,
      sandboxActions,
      isPatron,
      modalActions,
      currentUser,
      zenMode,
    } = this.props;

    return (
      <ThemeProvider
        theme={{
          templateColor: getTemplateDefinition(sandbox.template).color,
        }}
      >
        <Container>
          <div>
            {!zenMode && <Logo />}
            {!zenMode && (
              <WorkspaceItem defaultOpen keepState title="Project">
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
                  template={sandbox.template}
                />
              </WorkspaceItem>
            )}

            <Files sandbox={sandbox} sandboxActions={sandboxActions} />

            <WorkspaceItem title="Dependencies">
              <Dependencies
                sandboxId={sandbox.id}
                npmDependencies={sandbox.npmDependencies}
                externalResources={sandbox.externalResources}
                sandboxActions={sandboxActions}
                processing={
                  !!(
                    sandbox.dependencyBundle &&
                    sandbox.dependencyBundle.processing
                  )
                }
              />
            </WorkspaceItem>

            {!zenMode &&
              sandbox.owned &&
              currentUser &&
              currentUser.jwt &&
              !sandbox.git && (
                <WorkspaceItem title="GitHub">
                  {currentUser.integrations.github ? ( // eslint-disable-line
                    sandbox.originalGit ? (
                      <Git
                        sandboxId={sandbox.id}
                        originalGit={sandbox.originalGit}
                        gitChanges={sandbox.originalGitChanges}
                        fetchGitChanges={sandboxActions.fetchGitChanges}
                        createGitCommit={sandboxActions.createGitCommit}
                        createGitPR={sandboxActions.createGitPR}
                        openModal={modalActions.openModal}
                        closeModal={modalActions.closeModal}
                        user={currentUser}
                        modulesNotSaved={preventTransition}
                      />
                    ) : (
                      <CreateRepo
                        sandboxId={sandbox.id}
                        title={sandbox.title}
                        exportToGithub={sandboxActions.exportToGithub}
                        modulesNotSaved={preventTransition}
                        openModal={modalActions.openModal}
                        closeModal={modalActions.closeModal}
                      />
                    )
                  ) : (
                    <div>
                      <Margin
                        margin={1}
                        top={0}
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        You can create commits and open pull requests if you add
                        GitHub to your integrations.
                      </Margin>
                      <WorkspaceInputContainer>
                        <Button onClick={this.openPreferences} small block>
                          Open Integrations
                        </Button>
                      </WorkspaceInputContainer>
                    </div>
                  )}
                </WorkspaceItem>
              )}

            {!zenMode &&
              (sandbox.owned || sandbox.tags.length > 0) && (
                <WorkspaceItem title="Tags">
                  <Tags
                    sandboxId={sandbox.id}
                    addTag={sandboxActions.addTag}
                    removeTag={sandboxActions.removeTag}
                    isOwner={sandbox.owned}
                    tags={sandbox.tags}
                  />
                </WorkspaceItem>
              )}

            {!zenMode &&
              sandbox.owned && (
                <WorkspaceItem title="Sandbox Actions">
                  <SandboxActions
                    id={sandbox.id}
                    deleteSandbox={sandboxActions.deleteSandbox}
                    newSandboxUrl={sandboxActions.newSandboxUrl}
                    setSandboxPrivacy={sandboxActions.setSandboxPrivacy}
                    isPatron={isPatron}
                    privacy={sandbox.privacy}
                  />
                </WorkspaceItem>
              )}
          </div>

          {!zenMode && (
            <div>
              {!isPatron && !sandbox.owned && <Advertisement />}
              <ConnectionNotice />
              <TermsContainer>
                By using CodeSandbox you agree to our{' '}
                <Link to={tosUrl()}>Terms and Conditions</Link> and{' '}
                <Link to={privacyUrl()}>Privacy Policy</Link>.
              </TermsContainer>
            </div>
          )}
        </Container>
      </ThemeProvider>
    );
  }
}

// The skeleton to show if sandbox doesn't exist
const Skeleton = () => <Container />;

export default showAlternativeComponent(Skeleton, ['sandbox'])(
  connect(mapStateToProps, mapDispatchToProps)(Workspace)
);
