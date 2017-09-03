import React from 'react';
import styled from 'styled-components';

import moment from 'moment';

import FullHeartIcon from 'react-icons/lib/fa/heart';
import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';

import UserWithAvatar from 'app/components/user/UserWithAvatar';
import GithubBadge from 'app/components/sandbox/GithubBadge';

const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const UpdatedAt = styled.em`font-size: 0.75rem;`;

const Stats = styled.div`
  position: absolute;
  right: 0;

  font-size: 0.875rem;
  display: flex;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const StyledUser = styled(UserWithAvatar)`font-size: 0.75rem;`;

type Props = {
  author: ?{
    avatarUrl: string,
    username: string,
  },
  updatedAt: number,
  viewCount: number,
  forkCount: number,
  likeCount: number,
  git: {
    username: string,
    repot: string,
  },
};

type StatProps = {
  Icon: React.PureComponent,
  count: number,
};

const Stat = ({ Icon, count }: StatProps) => (
  <CenteredText style={{ fontSize: '.875rem' }}>
    <Icon />
    <span
      style={{
        marginLeft: '0.5rem',
        marginRight: '1rem',
        fontWeight: 300,
      }}
    >
      {count.toLocaleString()}
    </span>
  </CenteredText>
);

export default ({
  author,
  updatedAt,
  viewCount,
  forkCount,
  likeCount,
  git,
}: Props) => (
  <CenteredText>
    {author && (
      <StyledUser avatarUrl={author.avatar_url} username={author.username} />
    )}
    {git && <GithubBadge username={git.username} repo={git.repo} />}

    <UpdatedAt>{moment(updatedAt * 1000).fromNow()}</UpdatedAt>

    <Stats>
      <Stat Icon={EyeIcon} count={viewCount} />
      <Stat Icon={FullHeartIcon} count={likeCount} />
      <Stat Icon={ForkIcon} count={forkCount} />
    </Stats>
  </CenteredText>
);
