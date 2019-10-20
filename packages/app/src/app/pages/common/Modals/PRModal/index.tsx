import React from 'react';
import { useOvermind } from 'app/overmind';
import { GitProgress } from 'app/components/GitProgress';

const PRModal: React.FC = () => {
  let result = null;

  const {
    state: {
      git: {
        isCreatingPr,
        pr: { prURL },
      },
    },
  } = useOvermind();

  if (!isCreatingPr) {
    result = (
      <div>
        Done! We{"'"}ll now open the new sandbox of this PR and GitHub in 3
        seconds...
        <div style={{ fontSize: '.875rem', marginTop: '1rem' }}>
          <a href={prURL} target="_blank" rel="noreferrer noopener">
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
