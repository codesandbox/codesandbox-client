import React from 'react';
import styled from 'styled-components';
import delayEffect from 'app/utils/animation/delay-effect';
import { Link } from 'react-router-dom';

import UserIcon from 'react-icons/lib/ti/user';
import ExitIcon from 'react-icons/lib/md/exit-to-app';
import SettingsIcon from 'react-icons/lib/md/settings';

import { profileUrl, patronUrl } from 'app/utils/url-generator';
import PatronBadge from '../../utils/badges/PatronBadge';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background2.darken(0.5)};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.75);

  ${delayEffect(0)};
  top: 40px;
  left: -20%;
  right: 0;

  min-width: 150px;

  z-index: 20;
`;

const Item = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  font-size: .875rem;
  padding: 0.75rem 1rem;

  text-decoration: none;

  color: rgba(255, 255, 255, 0.8);
  border-left: 2px solid transparent;

  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.secondary};
    color: white;
    background-color: ${props => props.theme.secondary.clearer(0.9)};
  }
`;

const Icon = styled.span`margin-right: 0.75rem;`;

type Props = {
  username: string,
  signOut: () => any,
  openPreferences: () => any,
};

export default ({ username, openPreferences, signOut }: Props) =>
  <Container>
    <Link style={{ textDecoration: 'none' }} to={profileUrl(username)}>
      <Item>
        <Icon>
          <UserIcon />
        </Icon>My Profile
      </Item>
    </Link>
    <Item onClick={openPreferences}>
      <Icon>
        <SettingsIcon />
      </Icon>Preferences
    </Item>
    <Link style={{ textDecoration: 'none' }} to={patronUrl()}>
      <Item>
        <Icon>
          <PatronBadge style={{ width: 24, margin: '-6px -5px' }} size={24} />
        </Icon>Patron Page
      </Item>
    </Link>
    <Item onClick={signOut}>
      <Icon>
        <ExitIcon />
      </Icon>Sign out
    </Item>
  </Container>;
