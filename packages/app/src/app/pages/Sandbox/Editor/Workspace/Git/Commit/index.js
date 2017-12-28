import React from 'react';
import { inject, observer } from 'mobx-react';
import Progress from '../Progress';

function Commit({ store }) {
  const git = store.editor.currentSandbox.git;
  const commit = store.editor.git.commit;
  let message;

  if (store.editor.git.isComitting) {
    message = <div>Comitting, please wait...</div>;
  } else if (commit.newBranch) {
    const newUrl = `https://github.com/${git.username}/${git.repo}/compare/${
      git.branch
    }...${store.user.username}:${commit.newBranch}?expand=1`;
    message = (
      <div>
        There was a merge conflict while committing, you can open a PR instead.
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
    message = <div>Success!</div>;
  }

  return <Progress result={message} message="Creating Commit..." />;
}

export default inject('store')(observer(Commit));
