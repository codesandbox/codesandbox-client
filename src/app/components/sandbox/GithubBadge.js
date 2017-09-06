import React from 'react';
import styled, { css } from 'styled-components';

import GithubIcon from 'react-icons/lib/go/mark-github';

const BorderRadius = styled.div`
  transition: 0.3s ease all;
  border-radius: 4px;
  border: 1px solid #4f5459;
  font-size: 0.75rem;
  margin-right: 1rem;

  ${props =>
    props.hasUrl &&
    css`
      &:hover {
        background-color: #4f5459;
      }
    `};
`;

const Text = styled.span`
  display: inline-block;
  font-weight: 0.875rem;

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

const StyledA = styled.a`text-decoration: none;`;

type Props = {
  username: string,
  repo: string,
  url: ?string,
};

type DivOrAProps = {
  href: string,
};

const DivOrA = ({ href, ...props }: DivOrAProps) =>
  href ? (
    <StyledA target="_blank" rel="noopener noreferrer" href={href} {...props} />
  ) : (
    <div {...props} />
  );

export default ({ username, repo, url }: Props) => (
  <DivOrA href={url}>
    <BorderRadius hasUrl={!!url}>
      <Icon>
        <GithubIcon />
      </Icon>
      <Text>
        {username}/{repo}
      </Text>
    </BorderRadius>
  </DivOrA>
);
