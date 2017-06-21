import React from 'react';
import styled from 'styled-components';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

type Props = {
  likeCount: number,
  forkCount: number,
  viewCount: number,
};

const Count = styled.span`
  color: white;
  font-weight: 500;
`;

const CountDescription = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

const CountContainer = styled.div`
  margin: .5rem 1rem;
  font-size: .875rem;
`;

export default ({ likeCount, forkCount, viewCount }: Props) =>
  <div>
    <WorkspaceSubtitle>Statistics</WorkspaceSubtitle>
    <CountContainer>
      <Count>{likeCount}{' '}</Count>
      <CountDescription>
        {likeCount === 1 ? ' like' : ' likes'}
      </CountDescription>
    </CountContainer>
    <CountContainer>
      <Count>{forkCount}{' '}</Count>
      <CountDescription>
        {forkCount === 1 ? ' fork' : ' forks'}
      </CountDescription>
    </CountContainer>
    <CountContainer>
      <Count>{viewCount}{' '}</Count>
      <CountDescription>
        unique
        {viewCount === 1 ? ' view' : ' views'}
      </CountDescription>
    </CountContainer>
  </div>;
