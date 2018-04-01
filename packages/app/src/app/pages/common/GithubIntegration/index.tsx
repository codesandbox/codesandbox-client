import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import GithubLogo from 'react-icons/lib/go/mark-github';
import Integration from 'app/components/Integration';

type ExternalProps = {
    small?: boolean;
};

type Props = ExternalProps & WithCerebral;

const GithubIntegration: React.SFC<Props & WithCerebral> = ({ store, signals, small }) => {
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
};

export default connect<ExternalProps>()(GithubIntegration);
