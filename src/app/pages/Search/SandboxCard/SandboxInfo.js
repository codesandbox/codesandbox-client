import React from 'react';
import styled from 'styled-components';

import moment from 'moment';

import FullHeartIcon from 'react-icons/lib/fa/heart';
import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';

import GithubBadge from './GithubBadge';

const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const AuthorName = styled.span`
  text-transform: uppercase;
  margin: 0 0.5rem;
  margin-right: 1rem;
  font-size: .75rem;
  font-weight: 400;
`;

const Image = styled.img`border-radius: 4px;`;

const UpdatedAt = styled.em`font-size: .75rem;`;

const Stats = styled.div`
  position: absolute;
  right: 0;

  font-size: .875rem;
  display: flex;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

type Props = {
  author: ?{
    avatarUrl: string,
    username: string,
  },
  updatedAt: number,
  viewCount: number,
  forkCount: number,
  likeCount: number,
};

const Stat = ({ Icon, count }) =>
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
  </CenteredText>;

export default ({
  author,
  updatedAt,
  viewCount,
  forkCount,
  likeCount,
  git,
}: Props) =>
  <CenteredText>
    {author &&
      <CenteredText>
        <Image
          width={20}
          height={20}
          src={author.avatar_url}
          alt={author.username}
        />
        <AuthorName>
          {author.username}
        </AuthorName>
      </CenteredText>}
    {git && <GithubBadge username={git.username} repo={git.repo} />}

    <UpdatedAt>
      {moment(updatedAt * 1000).fromNow()}
    </UpdatedAt>

    <Stats>
      <Stat Icon={EyeIcon} count={viewCount} />
      <Stat Icon={FullHeartIcon} count={likeCount} />
      <Stat Icon={ForkIcon} count={forkCount} />
    </Stats>
  </CenteredText>;
