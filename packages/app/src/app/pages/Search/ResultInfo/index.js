import React from 'react';
import { Stats, ClearRefinements } from 'react-instantsearch/dom';

import { ClearAllContainer } from './elements';

function ResultInfo() {
  return (
    <div style={{ marginBottom: '1rem', fontSize: '.875rem' }}>
      <Stats />
      <ClearAllContainer>
        <ClearRefinements />
      </ClearAllContainer>
    </div>
  );
}

export default ResultInfo;
