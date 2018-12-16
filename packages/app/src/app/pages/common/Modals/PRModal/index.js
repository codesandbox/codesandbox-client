import React from 'react';
import { inject, observer } from 'mobx-react';
import GitProgress from 'app/components/GitProgress';
import styled from 'styled-components';

const PR = styled.div`
  font-size: 0.875rem;
  margin-top: 1rem;
`;

function PRModal({ store }) {
  let result = null;

  if (!store.git.isCreatingPr) {
    const newUrl = store.git.pr.prURL;

    result = (
      <div>
        Done! We{"'"}ll now open the new sandbox of this PR and GitHub in 3
        seconds...
        <PR>
          <a href={newUrl} target="_blank" rel="noreferrer noopener">
            Click here if nothing happens.
          </a>
        </PR>
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
