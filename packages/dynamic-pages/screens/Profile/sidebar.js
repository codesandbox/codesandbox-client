import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import Button from 'common/lib/components/Button';
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
  Title,
} from './_sidebar.elements';

import deleteAccount from '../../utils/deleteAccount';
import calendar from '../../assets/calendar.svg';
import mail from '../../assets/mail.svg';
import twitterLogo from '../../assets/twitter.svg';

import Modal from '../../components/Modal';

const kFormatter = num => (num > 999 ? (num / 1000).toFixed(1) + 'k' : num);

export default ({
  avatar_url,
  username,
  id,
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
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const closeAccount = async () => {
    setLoading(true);
    await deleteAccount({
      username,
      id,
    });
    setModal(false);
    setLoading(false);
    // logout
    localStorage.removeItem('jwt');
    // redirect to homepage
    window.location.href = 'http://codesabdox.io';
  };

  return (
    <>
      <Modal isOpen={modal} width={400}>
        <Title>Are you sure?</Title>
        <p>
          You can email us in the next 24 hours at{' '}
          <a href="mailto@codesandbox.io">hello@codesandbox.io</a> to revert the
          deleting.
        </p>
        <footer
          css={`
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-content: center;
            grid-column-gap: 40px;
          `}
        >
          <Button small disabled={loading} onClick={() => setModal(false)}>
            No, keep Account
          </Button>
          <Button
            small
            disabled={loading}
            danger
            onClick={() => closeAccount()}
          >
            Close Account
          </Button>
        </footer>
      </Modal>
      <aside
        css={`
          @media screen and (max-width: 1100px) {
            display: grid;
            grid-template-columns: 480px 1fr;
            grid-gap: 60px;
          }
          @media screen and (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        `}
      >
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

          {username === user.username && (
            <section
              css={`
                margin-top: 30px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                justify-content: center;
                grid-column-gap: 40px;
              `}
            >
              <Button small>Edit Profile</Button>
              <Button small danger onClick={() => setModal(true)}>
                Delete Account
              </Button>
            </section>
          )}
        </Aside>
        <Badges
          badges={badges}
          username={username}
          templateSandboxes={sandbox_count_per_template}
        />
      </aside>
    </>
  );
};
