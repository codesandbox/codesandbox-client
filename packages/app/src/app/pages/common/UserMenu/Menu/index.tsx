import { ChatIcon } from '@codesandbox/common/es/components/icons/Chat';
import { CogIcon } from '@codesandbox/common/es/components/icons/Cog';
import { CuratorIcon } from '@codesandbox/common/es/components/icons/Curator';
import { DashboardIcon } from '@codesandbox/common/es/components/icons/Dashboard';
import { DocumentationIcon } from '@codesandbox/common/es/components/icons/Documentation';
import { ExitIcon } from '@codesandbox/common/es/components/icons/Exit';
import { FolderIcon } from '@codesandbox/common/es/components/icons/Folder';
import { PatronIcon } from '@codesandbox/common/es/components/icons/Patron';
import { SearchIcon } from '@codesandbox/common/es/components/icons/Search';
import { UserIcon } from '@codesandbox/common/es/components/icons/User';
import track from '@codesandbox/common/es/utils/analytics';
import {
  curatorUrl,
  dashboardUrl,
  patronUrl,
  profileUrl,
  searchUrl,
} from '@codesandbox/common/es/utils/url-generator';
import React, { useEffect } from 'react';
import { MenuItem, MenuStateReturn, Menu as ReakitMenu } from 'reakit/Menu';

import {
  Container,
  Icon,
  ItemA,
  ItemButton,
  ItemLink,
  Separator,
} from './elements';
import { ProIcon } from './ProIcon';

interface Props {
  username: string;
  curator: string;
  openPreferences: () => void;
  openStorageManagement: () => void;
  openFeedback: () => void;
  signOut: () => void;
  menuProps: MenuStateReturn;
  showPatron: boolean;
  showManageSubscription: boolean;
  showBecomePro: boolean;
}

export const Menu = ({
  username,
  curator,
  openPreferences,
  openStorageManagement,
  openFeedback,
  signOut,
  menuProps,
  showPatron,
  showManageSubscription,
  showBecomePro,
}: Props) => {
  useEffect(() => {
    if (menuProps.visible) {
      track('User Menu Open');
    }
  }, [menuProps.visible]);

  return (
    <ReakitMenu {...menuProps} style={{ outline: 0 }} aria-label="user options">
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
            <DashboardIcon />
          </Icon>
          Dashboard
        </MenuItem>

        <MenuItem {...menuProps} href="/docs" as={ItemA}>
          <Icon>
            <DocumentationIcon />
          </Icon>
          Documentation
        </MenuItem>

        <MenuItem {...menuProps} to={searchUrl()} as={ItemLink}>
          <Icon>
            <SearchIcon />
          </Icon>
          Search Sandboxes
        </MenuItem>

        {curator && (
          <MenuItem {...menuProps} to={curatorUrl()} as={ItemLink}>
            <Icon>
              <CuratorIcon />
            </Icon>
            Curator Dashboard
          </MenuItem>
        )}

        {showPatron && (
          <MenuItem {...menuProps} to={patronUrl()} as={ItemLink}>
            <Icon>
              <PatronIcon />
            </Icon>
            Patron Page
          </MenuItem>
        )}

        {showBecomePro && (
          <MenuItem {...menuProps} as={ItemA} href="/pricing">
            <Icon>
              <ProIcon />
            </Icon>
            Upgrade to Pro
          </MenuItem>
        )}

        <Separator {...menuProps} />

        {showManageSubscription && (
          <MenuItem {...menuProps} as={ItemA} href="/pro">
            <Icon>
              <ProIcon />
            </Icon>
            Manage Subscription
          </MenuItem>
        )}

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
            <CogIcon />
          </Icon>
          Preferences
        </MenuItem>

        <Separator {...menuProps} />

        <MenuItem {...menuProps} as={ItemButton} onClick={openFeedback}>
          <Icon>
            <ChatIcon />
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
