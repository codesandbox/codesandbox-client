import React from 'react';
import { Stats, ClearRefinements } from 'react-instantsearch/dom';

import { ClearAllContainer } from './elements';

function ResultInfo() {
  return (
    <div
      css={`
        margin-bottom: 1rem;
        font-size: 0.875rem;
      `}
    >
      <Stats />
      <ClearAllContainer>
        <ClearRefinements />
      </ClearAllContainer>
    </div>
  );
}

export default ResultInfo;
