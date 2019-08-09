import React from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { BorderRadius, Text, Icon, StyledA } from './elements';

type BadgeProps = {
  username: string;
  repo: string;
  url?: string;
  branch: string;
};

type DivOrAProps = {
  href?: string;
  children: React.ReactNode;
};

const DivOrA = ({ href, ...props }: DivOrAProps) =>
  href ? (
    <StyledA target="_blank" rel="noopener noreferrer" href={href} {...props} />
  ) : (
    <div {...props} />
  );

function GithubBadge({ username, repo, url, branch, ...props }: BadgeProps) {
  return (
    <DivOrA {...props} href={url}>
      <BorderRadius hasUrl={Boolean(url)}>
        <Icon>
          <GithubIcon />
        </Icon>
        <Text>
          {username}/{repo}
          {branch && branch !== 'master' ? `@${branch}` : ''}
        </Text>
      </BorderRadius>
    </DivOrA>
  );
}

export default GithubBadge;
