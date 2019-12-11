import React, { FunctionComponent, useCallback } from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { BorderRadius, Text, Icon, StyledA } from './elements';

type BadgeProps = {
  username: string;
  repo: string;
  url?: string;
  branch: string;
  commitSha: string;
};

type DivOrAProps = {
  href?: string;
  children: React.ReactNode;
};

const DivOrA: FunctionComponent<DivOrAProps> = ({ href, ...props }) =>
  href ? (
    <StyledA target="_blank" rel="noopener noreferrer" href={href} {...props} />
  ) : (
    <div {...props} />
  );

const GithubBadge: FunctionComponent<BadgeProps> = ({
  username,
  repo,
  url,
  branch,
  commitSha,
  ...props
}) => {
  const getBadgeName = useCallback(() => {
    if (branch === commitSha) {
      return branch.substr(0, 7);
    }

    if (branch === 'master') {
      return undefined;
    }

    return branch;
  }, [branch, commitSha]);

  const displayBranch = getBadgeName();

  return (
    <DivOrA {...props} href={url}>
      <BorderRadius hasUrl={Boolean(url)}>
        <Icon>
          <GithubIcon />
        </Icon>
        <Text>
          {username}/{repo}
          {displayBranch ? `@${displayBranch}` : ''}
        </Text>
      </BorderRadius>
    </DivOrA>
  );
};

export default GithubBadge;
