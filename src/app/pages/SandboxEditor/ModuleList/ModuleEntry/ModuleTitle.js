// @flow
import React from 'react';
import styled from 'styled-components';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';

const TitleContainer = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding-right: 2.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const NotSyncedIconWithMargin = styled(NotSyncedIcon)`
  margin-left: 0.5rem;
  color: ${props => props.theme.secondary};
`;

export default ({ title, isNotSynced }: { title: string, isNotSynced: ?boolean }) => (
  <TitleContainer title={title}>
    {title}
    {isNotSynced && <NotSyncedIconWithMargin />}
  </TitleContainer>
);
