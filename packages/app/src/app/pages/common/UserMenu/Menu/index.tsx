import React, { useEffect } from 'react';

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

import {
  Container,
  Icon,
  Separator,
  ItemLink,
  ItemA,
  ItemButton,
} from './elements';
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
    <ReakitMenu {...menuProps} aria-label="user options">
      <Container>
        <MenuItem {...menuProps} to={profileUrl(username)} as={ItemLink}>
          <Icon>
            <UserIcon />
          </Icon>
          My Profile
        </MenuItem>

        <Separator {...menuProps} />

        <MenuItem {...menuProps} to={dashboardUrl()} as={ItemLink}>
          <Icon>
            <InfoIcon />
          </Icon>
          Dashboard
        </MenuItem>

        <MenuItem {...menuProps} href="/docs" as={ItemA}>
          <Icon>
            <BookIcon />
          </Icon>
          Documentation
        </MenuItem>

        {curator && (
          <MenuItem {...menuProps} to={curatorUrl()} as={ItemLink}>
            <Icon>
              <span style={{ width: 14 }} role="img" aria-label="Star">
                ✨
              </span>
            </Icon>
            Curator Dashboard
          </MenuItem>
        )}

        <MenuItem {...menuProps} to={patronUrl()} as={ItemLink}>
          <Icon>
            <PatronBadge style={{ width: 24, margin: '-6px -5px' }} size={24} />
          </Icon>
          Patron Page
        </MenuItem>

        <Separator {...menuProps} />

        <MenuItem
          {...menuProps}
          as={ItemButton}
          onClick={openStorageManagement}
        >
          <Icon>
            <FolderIcon />
          </Icon>
          Storage Management
        </MenuItem>

        <MenuItem {...menuProps} as={ItemButton} onClick={openPreferences}>
          <Icon>
            <SettingsIcon />
          </Icon>
          Preferences
        </MenuItem>

        <Separator {...menuProps} />

        <MenuItem {...menuProps} as={ItemButton} onClick={openFeedback}>
          <Icon>
            <FeedbackIcon />
          </Icon>
          Submit Feedback
        </MenuItem>

        <Separator {...menuProps} />

        <MenuItem {...menuProps} as={ItemButton} onClick={signOut}>
          <Icon>
            <ExitIcon />
          </Icon>
          Sign out
        </MenuItem>
      </Container>
    </ReakitMenu>
  );
};
