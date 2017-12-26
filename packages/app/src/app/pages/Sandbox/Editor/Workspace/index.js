import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import getTemplateDefinition from 'common/templates';
import { tosUrl, privacyUrl } from 'common/utils/url-generator';

import Button from 'app/components/Button';
import Margin from 'common/components/spacing/Margin';

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

import { Container, TermsContainer, WorkspaceInputContainer } from './elements';

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
                          signals.editor.workspace.integrationsOpened()
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
