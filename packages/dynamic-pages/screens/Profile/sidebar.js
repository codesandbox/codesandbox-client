import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Button from 'common/components/Button';
import { Forks, Likes, Views } from '../../components/Icons';
import { H3, H4 } from '../../components/Typography';
import Badges from './Badges';
import {
  Avatar,
  Header,
  Aside,
  Stats,
  Stat,
  Social,
} from './_sidebar.elements';

import calendar from '../../assets/calendar.svg';
import mail from '../../assets/mail.svg';
import twitterLogo from '../../assets/twitter.svg';

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
}) => {
  const [user, setUser] = useState({});

  const fetchCurrentUser = () => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const BASE =
      process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

    window
      .fetch(BASE + '/api/v1/users/current', {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then(x => x.json())
      .then(({ data }) => setUser(data));
  };

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      fetchCurrentUser();
    }
  }, []);

  return (
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
        {twitter && (
          <Social>
            <img src={twitterLogo} alt="twitter logo" />
            <a href={`https://twitter.com/${twitter}`} target="_blank">
              @{twitter.toLowerCase()}
            </a>
          </Social>
        )}
        {profile_email && (
          <Social>
            <img src={mail} alt="email" />
            <a href={`mailto:${profile_email}`} target="_blank">
              {profile_email.toLowerCase()}
            </a>
          </Social>
        )}
        <Social>
          <img src={calendar} alt="User Since" />
          <span>Joined {format(inserted_at, 'MMMM YYYY')}</span>
        </Social>
        {/*
        {username === user.username && (
          <Button
            small
            css={`
              width: 100%;
              margin-top: 30px;
            `}
          >
            Edit Profile
          </Button>
        )} */}
      </Aside>
      <Badges
        badges={badges}
        username={username}
        templateSandboxes={sandbox_count_per_template}
      />
    </aside>
  );
};
