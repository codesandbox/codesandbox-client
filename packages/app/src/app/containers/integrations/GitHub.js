import React from 'react';
import { inject, observer } from 'mobx-react';
import GithubLogo from 'react-icons/lib/go/mark-github';
import Integration from 'app/components/user/Integration';

export default inject('store', 'signals')(
  observer(({ store, signals }) => (
    <Integration
      name="GitHub"
      color="#4078c0"
      description="Commiting & Pull Requests"
      Icon={GithubLogo}
      userInfo={store.user.integrations.github}
      signOut={() => {
        signals.signOutGithubClicked();
      }}
      signIn={() => {
        signals.signInGithubClicked({ useExtraScopes: true });
      }}
      loading={store.isLoadingGithub}
    />
  ))
);
