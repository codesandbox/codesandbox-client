import { GitProgress } from 'app/components/GitProgress';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

const PRModal: FunctionComponent = () => {
  const {
    state: { git },
  } = useOvermind();

  let result = null;

  if (!git.isCreatingPr) {
    const newUrl = git.pr.prURL;

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
};

export default PRModal;
