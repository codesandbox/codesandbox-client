/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Features from '../../../components/Features/index';
import media from '../../../utils/media';

export const Title = styled.h3`
  font-family: Poppins;
  font-weight: bold;
  font-size: 50px;
  color: white;
  margin-top: 160px;

  ${media.phone`
    font-size: 34px;
  `};

  span {
    color: ${props => props.theme.secondary};
  }
`;

export const TagLine = styled.h4`
  margin: 24px 0;
  font-family: Open Sans;
  font-weight: normal;
  font-size: 28px;
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 64px;

  color: ${props => props.theme.lightText};

  span {
    font-weight: bold;
  }
`;

export default () => (
  <MaxWidth width={1440}>
    <Title>
      Be <span>productive</span>, anywhere.
    </Title>
    <TagLine>
      CodeSandbox helps you create web applications, from prototype to
      deployment.
    </TagLine>
    <Features />
  </MaxWidth>
);
