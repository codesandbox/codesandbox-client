import React from 'react';
import styled from 'styled-components';

import GithubIcon from 'react-icons/lib/go/mark-github';

const BorderRadius = styled.div`
  border-radius: 4px;
  border: 1px solid #4f5459;
  font-size: .75rem;
  margin-right: 1rem;
`;

const Text = styled.span`
  display: inline-block;
  font-weight: .875rem;

  color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  padding: 3px 5px;
`;

const Icon = styled.span`
  display: inline-block;
  padding: 3px 5px;
  background-color: #4f5459;
  border-radius: 2px;
  color: ${props => props.theme.background};
`;

export default ({ username, repo }) =>
  <BorderRadius>
    <Icon>
      <GithubIcon />
    </Icon>
    <Text>
      {username}/{repo}
    </Text>
  </BorderRadius>;
