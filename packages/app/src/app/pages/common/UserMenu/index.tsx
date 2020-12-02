import { ChatIcon } from '@codesandbox/common/lib/components/icons/Chat';
import { CogIcon } from '@codesandbox/common/lib/components/icons/Cog';
import { CuratorIcon } from '@codesandbox/common/lib/components/icons/Curator';
import { DashboardIcon } from '@codesandbox/common/lib/components/icons/Dashboard';
import { DocumentationIcon } from '@codesandbox/common/lib/components/icons/Documentation';
import { ExitIcon } from '@codesandbox/common/lib/components/icons/Exit';
import { FolderIcon } from '@codesandbox/common/lib/components/icons/Folder';
import { PatronIcon } from '@codesandbox/common/lib/components/icons/Patron';
import { SearchIcon } from '@codesandbox/common/lib/components/icons/Search';
import { UserIcon } from '@codesandbox/common/lib/components/icons/User';
import { ProIcon } from '@codesandbox/common/lib/components/icons/Pro';
import {
  curatorUrl,
  dashboardUrl,
  patronUrl,
  profileUrl,
  searchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Menu, Stack, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { Icon, ProfileImage } from './elements';

export const UserMenu: FunctionComponent & {
  Button: (props: any) => JSX.Element;
} = props => {
  const {
    actions: {
      modalOpened,
      signOutClicked,
      files: { gotUploadedFiles },
    },
    state: { user },
  } = useOvermind();

  if (!user) {
    return null;
  }

  const showPatron = user.subscription?.plan === 'patron';
  const showCurator = user.curatorAt;
  const showBecomePro = !user.subscription;
  const showManageSubscription = user.subscription?.plan === 'pro';

  return (
    <Element>
      <Menu>
        {props.children || (
          <ProfileImage
            alt={user.username}
            width={30}
            height={30}
            src={user.avatarUrl}
            as={Menu.Button}
          />
        )}

        <Menu.List>
          <Menu.Link to={profileUrl(user.username)}>
            <Stack align="center">
              <Icon>
                <UserIcon />
              </Icon>
              My Profile
            </Stack>
          </Menu.Link>

          <Menu.Divider />

          <Menu.Link to={dashboardUrl()}>
            <Stack align="center">
              <Icon>
                <DashboardIcon />
              </Icon>
              Dashboard
            </Stack>
          </Menu.Link>

          <Menu.Link href="/docs">
            <Stack align="center">
              <Icon>
                <DocumentationIcon />
              </Icon>
              Documentation
            </Stack>
          </Menu.Link>

          <Menu.Link to={searchUrl()}>
            <Stack align="center">
              <Icon>
                <SearchIcon />
              </Icon>
              Search Sandboxes
            </Stack>
          </Menu.Link>

          {showCurator && (
            <Menu.Link to={curatorUrl()}>
              <Stack align="center">
                <Icon>
                  <CuratorIcon />
                </Icon>
                Curator Dashboard
              </Stack>
            </Menu.Link>
          )}

          {showPatron && (
            <Menu.Link to={patronUrl()}>
              <Stack align="center">
                <Icon>
                  <PatronIcon />
                </Icon>
                Patron Page
              </Stack>
            </Menu.Link>
          )}

          {showBecomePro && (
            <Menu.Link href="/pricing">
              <Stack align="center">
                <Icon>
                  <ProIcon />
                </Icon>
                Upgrade to Pro
              </Stack>
            </Menu.Link>
          )}

          <Menu.Divider />

          {showManageSubscription && (
            <Menu.Link href="/pro">
              <Stack align="center">
                <Icon>
                  <ProIcon />
                </Icon>
                Manage Subscription
              </Stack>
            </Menu.Link>
          )}

          <Menu.Item onClick={() => gotUploadedFiles(null)}>
            <Stack align="center">
              <Icon>
                <FolderIcon />
              </Icon>
              Storage Management
            </Stack>
          </Menu.Item>

          <Menu.Item onClick={() => modalOpened({ modal: 'preferences' })}>
            <Stack align="center">
              <Icon>
                <CogIcon />
              </Icon>
              Preferences
            </Stack>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item onClick={() => modalOpened({ modal: 'feedback' })}>
            <Stack align="center">
              <Icon>
                <ChatIcon />
              </Icon>
              Submit Feedback
            </Stack>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item onClick={() => signOutClicked()}>
            <Stack align="center">
              <Icon>
                <ExitIcon />
              </Icon>
              Sign out
            </Stack>
          </Menu.Item>
        </Menu.List>
      </Menu>
    </Element>
  );
};

UserMenu.Button = Menu.Button;
