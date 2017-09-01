import React from 'react';
import styled from 'styled-components';
import { Stats, ClearAll } from 'react-instantsearch/dom';

const ClearAllContainer = styled.div`float: right;`;

export default () => (
  <div style={{ marginBottom: '1rem', fontSize: '.875rem' }}>
    <Stats />
    <ClearAllContainer>
      <ClearAll />
    </ClearAllContainer>
  </div>
);
