import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import GithubIntegration from '../../../../../common/GithubIntegration';
import Git from '../../Git';
import CreateRepo from '../../CreateRepo';
import { Description } from '../../elements';

type Props = WithCerebral;

const GitHub: React.SFC<Props> = ({ store }) => {
    const sandbox = store.editor.currentSandbox;

    return store.user.integrations.github ? sandbox.originalGit ? ( // eslint-disable-line
        <Git />
    ) : (
        <CreateRepo />
    ) : (
        <div>
            <Description style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                You can create commits and open pull requests if you add GitHub to your integrations.
            </Description>

            <div style={{ margin: '1rem' }}>
                <GithubIntegration small />
            </div>
        </div>
    );
};

export default connect<Props>()(GitHub);
