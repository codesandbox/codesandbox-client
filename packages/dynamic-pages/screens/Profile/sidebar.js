import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import Badge from 'common/utils/badges/Badge';
import Button from 'common/components/Button';
import ContributorsBadge from 'common/components/ContributorsBadge';
import CommunityBadge from 'common/components/CommunityBadges';
import { Forks, Likes, Views } from '../../components/Icons';
import { H3, H4 } from '../../components/Typography';

import calendar from '../../assets/calendar.svg';
import mail from '../../assets/mail.svg';
import twitterLogo from '../../assets/twitter.svg';

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
  margin: 32px 0;
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
  flex-wrap: wrap;
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

const Social = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 0;
  padding: 0;
  margin-left: -8px;

  span {
    color: #b8b9ba;
    margin-left: 8px;
  }

  a {
    color: #66b9f4;
    margin-left: 8px;
    text-decoration: none;
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
  sandbox_count_per_template,
  inserted_at,
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
      <Social>
        <img src={twitterLogo} alt="twitter logo" />
        <a href={`https://twitter.com/${twitter}`} target="_blank">
          @{twitter.toLowerCase()}
        </a>
      </Social>
      <Social>
        <img src={mail} alt="email" />
        <a href={`mailto:${profile_email}`} target="_blank">
          {profile_email.toLowerCase()}
        </a>
      </Social>
      <Social>
        <img src={calendar} alt="User Since" />
        <span>Joined {format(inserted_at, 'MMMM YYYY')}</span>
      </Social>

      <Button
        small
        css={`
          width: 100%;
          margin-top: 30px;
        `}
      >
        Edit Profile
      </Button>
    </Aside>
    <Aside
      css={`
        margin-top: 50px;
      `}
    >
      <H3>Achievement Badges</H3>
      <Badges>
        {badges.map(badge => (
          <Badge key={badge.id} badge={badge} size={64} />
        ))}
        <ContributorsBadge
          username={username}
          style={{
            width: 64,
            height: 50,
          }}
        />
        {Object.keys(sandbox_count_per_template).map(
          key =>
            sandbox_count_per_template[key] > 50 && (
              <CommunityBadge
                template={key}
                sandboxNumber={sandbox_count_per_template[key]}
                style={{
                  width: 64,
                  height: 50,
                }}
              />
            )
        )}
      </Badges>
    </Aside>
  </aside>
);
