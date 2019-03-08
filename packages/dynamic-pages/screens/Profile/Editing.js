import React, { useState } from 'react';
import { format } from 'date-fns';
import Input, { TextArea } from 'common/lib/components/Input';
import calendar from '../../assets/calendar.svg';
import mail from '../../assets/mail.svg';
import twitterLogo from '../../assets/twitter.svg';

import { Social } from './_sidebar.elements';

export default ({
  children,
  bio,
  twitter,
  profile_email,
  inserted_at,
  editing,
  changeBio,
  changeTwitter,
  changeEmail,
}) => {
  const [biography, setBiography] = useState(bio);
  const [tw, setTw] = useState(twitter);
  const [email, setEmail] = useState(profile_email);

  return (
    <>
      {editing ? (
        <TextArea
          fullWidth
          placeholder="This is where you tell us all about you"
          value={biography}
          onChange={e => {
            changeBio(e.target.value);
            setBiography(e.target.value);
          }}
        />
      ) : (
        <p
          css={`
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
            max-height: 12rem;
            overflow: hidden;
          `}
        >
          {biography}
        </p>
      )}
      {children}
      {editing && (
        <Social>
          <img src={twitterLogo} alt="twitter logo" />
          <Input
            placeholder="Your Twitter"
            fullWidth
            value={tw}
            onChange={e => {
              changeTwitter(e.target.value);
              setTw(e.target.value);
            }}
          />
        </Social>
      )}
      {twitter &&
        !editing && (
          <Social>
            <img src={twitterLogo} alt="twitter logo" />
            <a href={`https://twitter.com/${twitter}`} target="_blank">
              @{twitter.toLowerCase()}
            </a>
          </Social>
        )}
      {editing && (
        <Social>
          <img src={mail} alt="email" />
          <Input
            fullWidth
            placeholder="Your Public Email"
            value={email}
            type="email"
            onChange={e => {
              changeEmail(e.target.value);
              setEmail(e.target.value);
            }}
          />
        </Social>
      )}
      {profile_email &&
        !editing && (
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
    </>
  );
};
