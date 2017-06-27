import React from 'react';
import styled from 'styled-components';
import WorkspaceSubtitle from '../../WorkspaceSubtitle';

import StatCount from './StatCount';

type Props = {
  likeCount: number,
  forkCount: number,
  viewCount: number,
};

const StyledStatCount = styled(StatCount)`
  margin: .5rem 1rem;
  font-size: .875rem;
`;

export default ({ likeCount, forkCount, viewCount }: Props) =>
  <div>
    <WorkspaceSubtitle>Statistics</WorkspaceSubtitle>
    <StyledStatCount count={likeCount} singular="like" plural="likes" />
    <StyledStatCount count={forkCount} singular="fork" plural="forks" />
    <StyledStatCount count={viewCount} singular="view" plural="views" />
  </div>;
