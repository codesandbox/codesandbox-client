import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import getTemplateDefinition from 'common/templates';
import { tosUrl, privacyUrl } from 'common/utils/url-generator';

import Files from './items/Files';

import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';

import { Container, TermsContainer } from './elements';

const idToItem = {
  files: Files,
};

function Workspace({ signals, store }) {
  const sandbox = store.editor.currentSandbox;
  const preferences = store.preferences;

  const currentItem = store.workspace.openedWorkspaceItem;
  const Component = idToItem[currentItem];
  return (
    <ThemeProvider
      theme={{
        templateColor: getTemplateDefinition(sandbox.template).color,
      }}
    >
      <Container>
        <Component />
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
