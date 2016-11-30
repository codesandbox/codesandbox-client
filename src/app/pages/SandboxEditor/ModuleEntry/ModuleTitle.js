// @flow
import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.span`
  margin-left: 0.5rem;
`;

export default ({ title }: { title: string }) => <TitleContainer>{title}</TitleContainer>;
