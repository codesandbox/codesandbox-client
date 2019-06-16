import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import UserIcon from 'react-icons/lib/ti/user';
import ExitIcon from 'react-icons/lib/md/exit-to-app';
import FolderIcon from 'react-icons/lib/md/folder';
import SettingsIcon from 'react-icons/lib/md/settings';
import BookIcon from 'react-icons/lib/md/library-books';

import {
  profileUrl,
  patronUrl,
  curatorUrl,
  dashboardUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import PatronBadge from '@codesandbox/common/lib/utils/badges/PatronBadge';
// @ts-ignore
import InfoIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/sandbox.svg';
import track from '@codesandbox/common/lib/utils/analytics';

import { Container, Item, Icon, Separator } from './elements';
import FeedbackIcon from './FeedbackIcon';

interface Props {
  username: string;
  curator: boolean;
  openPreferences: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  openStorageManagement: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  openFeedback: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  signOut: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Menu = ({
  username,
  curator,
  openPreferences,
  openStorageManagement,
  openFeedback,
  signOut,
}: Props) => {
  useEffect(() => {
    track('User Menu Open');
  }, []);

  return (
    <Container>
      <Item as={Link} to={profileUrl(username)}>
        <Icon>
          <UserIcon />
        </Icon>
        My Profile
      </Item>

      <Separator />

      <Item as={Link} to={dashboardUrl()}>
        <Icon>
          <InfoIcon />
        </Icon>
        Dashboard
      </Item>

      <Item as="a" href="/docs">
        <Icon>
          <BookIcon />
        </Icon>
        Documentation
      </Item>

      {curator && (
        <Item as={Link} to={curatorUrl()}>
          <Icon>
            <span style={{ width: 14 }} role="img" aria-label="Star">
              ✨
            </span>
          </Icon>
          Curator Dashboard
        </Item>
      )}

      <Item as={Link} to={patronUrl()}>
        <Icon>
          <PatronBadge style={{ width: 24, margin: '-6px -5px' }} size={24} />
        </Icon>
        Patron Page
      </Item>

      <Separator />

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

      <Separator />

      <Item onClick={openFeedback}>
        <Icon>
          <FeedbackIcon />
        </Icon>
        Submit Feedback
      </Item>

      <Separator />

      <Item onClick={signOut}>
        <Icon>
          <ExitIcon />
        </Icon>
        Sign out
      </Item>
    </Container>
  );
};

export default Menu;
