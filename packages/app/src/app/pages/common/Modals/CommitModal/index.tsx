import * as React from 'react';
import { connect } from 'app/fluent';
import GitProgress from 'app/components/GitProgress';



export default connect()
  .with(({ state }) => ({
    username: state.user.username,
    git: state.editor.currentSandbox.originalGit,
    commit: state.git.commit
  }))
  .to(
    function CommitModal({ username, git, commit }) {
      let message;

      if (commit) {
        if (commit.newBranch) {
          const newUrl = `https://github.com/${git.username}/${git.repo}/compare/${
            git.branch
          }...${username}:${commit.newBranch}?expand=1`;
          message = (
            <div>
              There was a merge conflict while committing, you can open a PR
              instead.
              <div style={{ fontSize: '.875rem', marginTop: '1rem' }}>
                <a href={newUrl} target="_blank" rel="noreferrer noopener">
                  Click here to open a PR
                </a>
              </div>
            </div>
          );
        } else if (commit.merge) {
          message = (
            <div>
              Success! There were other commits, so we merged your changes in and
              opened an up to date sandbox.
            </div>
          );
        } else {
          message = <div>Succesfully created commit!</div>;
        }
      }

      return <GitProgress result={message} message="Creating Commit..." />;
    }
  )
