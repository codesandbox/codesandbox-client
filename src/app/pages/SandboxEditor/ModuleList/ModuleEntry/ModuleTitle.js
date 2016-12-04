// @flow
import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding-right: 2.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export default ({ title }: { title: string }) => (
  <TitleContainer title={title}>
    {title}
  </TitleContainer>
);
