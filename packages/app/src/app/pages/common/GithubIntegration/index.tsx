import * as React from 'react';
import { connect } from 'app/fluent'
import GithubLogo from 'react-icons/lib/go/mark-github';
import Integration from 'app/components/Integration';

type Props = {
  small?: boolean
}

export default connect<Props>()
  .with(({ state, signals }) => ({
    isLoadingGithub: state.isLoadingGithub,
    githubIntegration: state.user.integrations.github,
    signOutGithubIntegration: signals.signOutGithubIntegration,
    signInGithubClicked: signals.signInGithubClicked
  }))
  .to(
    function GithubIntegration({ isLoadingGithub, githubIntegration, signOutGithubIntegration, signInGithubClicked, small }) {
      return (
        <Integration
          name="GitHub"
          color="#4078c0"
          description={small ? 'Commits & PRs' : 'Commiting & Pull Requests'}
          Icon={GithubLogo}
          small={small}
          userInfo={githubIntegration}
          signOut={() => signOutGithubIntegration()}
          signIn={() => signInGithubClicked({ useExtraScopes: true })}
          loading={isLoadingGithub}
        />
      );
    }
  )
