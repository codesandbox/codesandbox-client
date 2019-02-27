import React from 'react';
import styled from 'styled-components';

import Badge from 'common/utils/badges/Badge';
import ContributorsBadge from 'common/components/ContributorsBadge';
import { Forks, Likes, Views } from '../../components/Icons';
import { H3, H4 } from '../../components/Typography';

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 8px;
  margin-right: 32px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const Aside = styled.div`
  background: #1c2022;
  border-radius: 8px;
  padding: 32px;
`;

const Stats = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(3, min-content);
  grid-gap: 35px;
`;

const Badges = styled.ul`
  margin: 0;
  padding: 0;
  margin-top: 20px;
  display: flex;
  align-items: center;
  > * {
    margin-right: 10px;
  }
`;

const Stat = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;
const kFormatter = num => (num > 999 ? (num / 1000).toFixed(1) + 'k' : num);

export default ({
  avatar_url,
  username,
  bio,
  name,
  view_count,
  received_like_count,
  forked_count,
  badges,
  twitter,
  profile_email,
  // sandbox_count_per_template,
}) => (
  <aside>
    <Aside>
      <Header>
        <Avatar src={avatar_url} alt={name} width="96" height="96" />
        <div>
          <H3>{name}</H3>
          <H4>{username}</H4>
        </div>
      </Header>
      <p>{bio}</p>
      <p>{twitter}</p>
      <p>{profile_email}</p>
      <Stats>
        <Stat>
          <Views /> {kFormatter(view_count)}
        </Stat>
        <Stat>
          <Likes /> {kFormatter(received_like_count)}
        </Stat>
        <Stat>
          <Forks /> {kFormatter(forked_count)}
        </Stat>
      </Stats>
    </Aside>
    <Aside
      css={`
        margin-top: 50px;
      `}
    >
      <H3>Achievement Badges</H3>
      <Badges>
        {badges.map(badge => <Badge key={badge.id} badge={badge} size={64} />)}
        <ContributorsBadge
          username={username}
          style={{
            width: 64,
            height: 50,
          }}
        />
      </Badges>
    </Aside>
  </aside>
);
