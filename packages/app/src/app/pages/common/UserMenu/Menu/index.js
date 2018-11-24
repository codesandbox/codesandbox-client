import React from 'react';
import { Link } from 'react-router-dom';

import UserIcon from 'react-icons/lib/ti/user';
import ExitIcon from 'react-icons/lib/md/exit-to-app';
import FolderIcon from 'react-icons/lib/md/folder';
import SettingsIcon from 'react-icons/lib/md/settings';
import { profileUrl, patronUrl, curatorUrl } from 'common/utils/url-generator';
import PatronBadge from 'common/utils/badges/PatronBadge';

import { Container, Item, Icon } from './elements';

function Menu({
  username,
  curator,
  openPreferences,
  openStorageManagement,
  signOut,
}) {
  return (
    <Container>
      <Link style={{ textDecoration: 'none' }} to={profileUrl(username)}>
        <Item>
          <Icon>
            <UserIcon />
          </Icon>
          My Profile
        </Item>
      </Link>
      <Item onClick={openStorageManagement}>
        <Icon>
          <FolderIcon />
        </Icon>
        Storage Management
      </Item>
      <Item onClick={openPreferences}>
        <Icon>
          <SettingsIcon />
        </Icon>
        Preferences
      </Item>
      {curator && (
        <Link style={{ textDecoration: 'none' }} to={curatorUrl()}>
          <Item>
            <Icon style={{ marginRight: 7 }}>
              <span role="img" aria-label="Star">
                ✨
              </span>
            </Icon>
            Curator Page
          </Item>
        </Link>
      )}
      <Link style={{ textDecoration: 'none' }} to={patronUrl()}>
        <Item>
          <Icon>
            <PatronBadge style={{ width: 24, margin: '-6px -5px' }} size={24} />
          </Icon>
          Patron Page
        </Item>
      </Link>

      <Item onClick={signOut}>
        <Icon>
          <ExitIcon />
        </Icon>
        Sign out
      </Item>
    </Container>
  );
}

export default Menu;
