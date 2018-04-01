import React from 'react';
import { inject, observer } from 'mobx-react';
import GitProgress from 'app/components/GitProgress';

function PRModal({ store }) {
  let result = null;

  if (!store.git.isCreatingPr) {
    const pr = store.git.pr;
    const git = store.editor.currentSandbox.originalGit;
    const newUrl = `https://github.com/${git.username}/${git.repo}/compare/${
      git.branch
    }...${store.user.username}:${pr.newBranch}?expand=1`;

    result = (
      <div>
        Done! We{"'"}ll now open the new sandbox of this PR and GitHub in 3
        seconds...
        <div style={{ fontSize: '.875rem', marginTop: '1rem' }}>
          <a href={newUrl} target="_blank" rel="noreferrer noopener">
            Click here if nothing happens.
          </a>
        </div>
      </div>
    );
  }

  return (
    <GitProgress
      result={result}
      message="Forking Repository & Creating PR..."
    />
  );
}

export default inject('store')(observer(PRModal));
