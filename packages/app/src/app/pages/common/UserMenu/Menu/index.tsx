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
import track from '@codesandbox/common/lib/utils/analytics';
import { MenuItem, Menu as ReakitMenu, MenuStateReturn } from 'reakit/Menu';
// @ts-ignore
import InfoIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/sandbox.svg';

import { Container, Item, Icon, Separator, LinkItem } from './elements';
import { FeedbackIcon } from './FeedbackIcon';

interface Props {
  username: string;
  curator: string;
  openPreferences: () => void;
  openStorageManagement: () => void;
  openFeedback: () => void;
  signOut: () => void;
  menuProps: MenuStateReturn;
}

export const Menu = ({
  username,
  curator,
  openPreferences,
  openStorageManagement,
  openFeedback,
  signOut,
  menuProps,
}: Props) => {
  useEffect(() => {
    if (menuProps.visible) {
      track('User Menu Open');
    }
  }, [menuProps.visible]);

  return (
    <ReakitMenu {...menuProps} unstable_portal>
      <Container>
        <MenuItem as={Item} {...menuProps}>
          <LinkItem to={profileUrl(username)}>
            <Icon>
              <UserIcon />
            </Icon>
            My Profile
          </LinkItem>
        </MenuItem>

        <Separator role="presentation" />
        <MenuItem as={Item} {...menuProps}>
          <LinkItem to={dashboardUrl()}>
            <Icon>
              <InfoIcon />
            </Icon>
            Dashboard
          </LinkItem>
        </MenuItem>

        <MenuItem as={Item} {...menuProps}>
          <LinkItem as="a" href="/docs">
            <Icon>
              <BookIcon />
            </Icon>
            Documentation
          </LinkItem>
        </MenuItem>

        {curator && (
          <MenuItem as={Item} {...menuProps}>
            <LinkItem to={curatorUrl()}>
              <Icon>
                <span style={{ width: 14 }} role="img" aria-label="Star">
                  ✨
                </span>
              </Icon>
              Curator Dashboard
            </LinkItem>
          </MenuItem>
        )}

        <MenuItem as={Item} {...menuProps}>
          <LinkItem as={Link} to={patronUrl()}>
            <Icon>
              <PatronBadge
                style={{ width: 24, margin: '-6px -5px' }}
                size={24}
              />
            </Icon>
            Patron Page
          </LinkItem>
        </MenuItem>

        <Separator role="presentation" />

        <MenuItem as={Item} {...menuProps} onClick={openStorageManagement}>
          <Icon>
            <FolderIcon />
          </Icon>
          Storage Management
        </MenuItem>

        <MenuItem as={Item} {...menuProps} onClick={openPreferences}>
          <Icon>
            <SettingsIcon />
          </Icon>
          Preferences
        </MenuItem>

        <Separator role="presentation" />

        <MenuItem as={Item} {...menuProps} onClick={openFeedback}>
          <Icon>
            <FeedbackIcon />
          </Icon>
          Submit Feedback
        </MenuItem>

        <Separator role="presentation" />
        <MenuItem as={Item} {...menuProps} onClick={signOut}>
          <Icon>
            <ExitIcon />
          </Icon>
          Sign out
        </MenuItem>
      </Container>
    </ReakitMenu>
  );
};
