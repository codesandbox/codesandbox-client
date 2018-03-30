import * as React from 'react';
import { connect } from 'app/fluent';
import GitProgress from 'app/components/GitProgress';

export default connect()
    .with(({ state }) => ({
        username: state.user.username,
        originalGit: state.editor.currentSandbox.originalGit,
        git: { ...state.git }
    }))
    .to(function PRModal({ username, git, originalGit }) {
        let result = null;

        if (!git.isCreatingPr) {
            const pr = git.pr;
            // tslint:disable-next-line
            const newUrl = `https://github.com/${pr.git.username}/${pr.git.repo}/compare/${pr.git
                .branch}...${username}:${pr.newBranch}?expand=1`;

            result = (
                <div>
                    Done! We{"'"}ll now open the new sandbox of this PR and GitHub in 3 seconds...
                    <div style={{ fontSize: '.875rem', marginTop: '1rem' }}>
                        <a href={newUrl} target="_blank" rel="noreferrer noopener">
                            Click here if nothing happens.
                        </a>
                    </div>
                </div>
            );
        }

        return <GitProgress result={result} message="Forking Repository & Creating PR..." />;
    });
