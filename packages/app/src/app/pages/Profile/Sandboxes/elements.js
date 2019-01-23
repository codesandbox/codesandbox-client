import * as React from 'react';
import styled from 'styled-components';

import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';

export const Navigation = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding-bottom: 2rem;
`;

export const Notice = styled.div`
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem 0;
  padding-bottom: 0;

  margin-bottom: 2rem;
`;

const ErrorTitle = styled.div`
  font-size: 1.25rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;
const prefix = {
  currentSandboxes: ["You don't have", "This user doesn't have"],
  currentLikedSandboxes: ["You didn't like", "This user didn't like"],
};
export const NoSandboxes = ({ source, isCurrentUser }) => (
  <Centered vertical horizontal>
    <Margin top={4}>
      <ErrorTitle>
        {prefix[source][isCurrentUser ? 0 : 1]} any sandboxes yet
      </ErrorTitle>
    </Margin>
  </Centered>
);
