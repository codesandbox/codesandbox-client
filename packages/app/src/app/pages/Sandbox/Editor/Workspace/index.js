// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import getTemplateDefinition from 'common/templates';
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

function Workspace({ signals, store }) {
  const sandbox = store.editor.currentSandbox;
  const preferences = store.editor.preferences;

  return (
    <ThemeProvider
      theme={{
        templateColor: getTemplateDefinition(sandbox.template).color,
      }}
    >
      <Container>
        <div>
          {!preferences.settings.zenMode && <Logo />}
          {!preferences.settings.zenMode && (
            <WorkspaceItem defaultOpen keepState title="Project">
              <Project />
            </WorkspaceItem>
          )}

          <Files />

          <WorkspaceItem title="Dependencies">
            <Dependencies />
          </WorkspaceItem>

          {!preferences.settings.zenMode &&
            sandbox.owned &&
            store.isLoggedIn &&
            !sandbox.git && (
              <WorkspaceItem title="GitHub">
                {store.user.integrations.github ? ( // eslint-disable-line
                  sandbox.originalGit ? (
                    <Git />
                  ) : (
                    <CreateRepo />
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
                      <Button
                        onClick={() =>
                          signals.modalOpened({ modal: 'preferences' })
                        }
                        small
                        block
                      >
                        Open Integrations
                      </Button>
                    </WorkspaceInputContainer>
                  </div>
                )}
              </WorkspaceItem>
            )}

          {!preferences.settings.zenMode &&
            (sandbox.owned || sandbox.tags.length > 0) && (
              <WorkspaceItem title="Tags">
                <Tags />
              </WorkspaceItem>
            )}

          {!preferences.settings.zenMode &&
            sandbox.owned && (
              <WorkspaceItem title="Sandbox Actions">
                <SandboxActions />
              </WorkspaceItem>
            )}
        </div>
        {!preferences.settings.zenMode && (
          <div>
            {!store.isPatron && !sandbox.owned && <Advertisement />}
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

export default inject('signals', 'store')(observer(Workspace));
