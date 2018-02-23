import React from 'react';
import { inject, observer } from 'mobx-react';
import GithubLogo from 'react-icons/lib/go/mark-github';
import Integration from 'app/components/Integration';

function GithubIntegration({ store, signals, small }) {
  return (
    <Integration
      name="GitHub"
      color="#4078c0"
      description={small ? 'Commits & PRs' : 'Commiting & Pull Requests'}
      Icon={GithubLogo}
      small={small}
      userInfo={store.user.integrations.github}
      signOut={() => signals.signOutGithubIntegration()}
      signIn={() => signals.signInGithubClicked({ useExtraScopes: true })}
      loading={store.isLoadingGithub}
    />
  );
}

export default inject('store', 'signals')(observer(GithubIntegration));
