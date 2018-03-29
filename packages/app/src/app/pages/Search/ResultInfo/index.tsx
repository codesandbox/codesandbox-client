import * as React from 'react';
import { Stats, ClearAll } from 'react-instantsearch/dom';

import { ClearAllContainer } from './elements';

const ResultInfo: React.SFC<{}> = () => {
  return (
    <div style={{ marginBottom: '1rem', fontSize: '.875rem' }}>
      <Stats />
      <ClearAllContainer>
        <ClearAll />
      </ClearAllContainer>
    </div>
  );
}

export default ResultInfo;
