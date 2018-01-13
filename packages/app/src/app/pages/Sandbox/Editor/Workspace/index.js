import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { tosUrl, privacyUrl } from 'common/utils/url-generator';
import workspaceItems from 'app/store/modules/workspace/items';

import Files from './items/Files';
import ProjectInfo from './items/ProjectInfo';
import GitHub from './items/GitHub';
import Deployment from './items/Deployment';
import NotOwnedSandboxInfo from './items/NotOwnedSandboxInfo';

import ConnectionNotice from './ConnectionNotice';
import Advertisement from './Advertisement';

import { Container, TermsContainer, ItemTitle } from './elements';

const idToItem = {
  project: ProjectInfo,
  files: Files,
  github: GitHub,
  deploy: Deployment,
};

function Workspace({ store }) {
  const sandbox = store.editor.currentSandbox;
  const preferences = store.preferences;

  const currentItem = store.workspace.openedWorkspaceItem;

  if (!currentItem) {
    return null;
  }

  const Component = sandbox.owned ? idToItem[currentItem] : NotOwnedSandboxInfo;

  const item = workspaceItems.find(i => i.id === currentItem);
  return (
    <Container>
      {sandbox.owned && <ItemTitle>{item.name}</ItemTitle>}
      <div style={{ flex: 1 }}>
        <Component />
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
  );
}

export default inject('signals', 'store')(observer(Workspace));
