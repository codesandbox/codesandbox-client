import React from 'react';
import moment from 'moment';

import FullHeartIcon from 'react-icons/lib/fa/heart';
import EyeIcon from 'react-icons/lib/fa/eye';
import ForkIcon from 'react-icons/lib/go/repo-forked';

import GithubBadge from 'common/components/GithubBadge';

import Stat from './Stat';
import { CenteredText, UpdatedAt, Stats, StyledUser } from './elements';

function SandboxInfo({
  author,
  updatedAt,
  viewCount,
  forkCount,
  likeCount,
  git,
}) {
  return (
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
}

export default SandboxInfo;
