import * as React from 'react';
import { connect } from 'app/fluent';

import GithubIntegration from '../../../../../common/GithubIntegration';
import Git from '../../Git';
import CreateRepo from '../../CreateRepo';
import { Description } from '../../elements';

export default connect()
    .with(({ state }) => ({
        sandbox: state.editor.currentSandbox,
        github: state.user.integrations.github
    }))
    .to(function GitHub({ sandbox, github }) {
        return github ? sandbox.originalGit ? (
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
    });
