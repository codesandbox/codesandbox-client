import {
  curatorUrl,
  dashboardUrl,
  profileUrl,
  searchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Menu, Stack, Element, Icon, Text } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { TeamMemberAuthorization } from 'app/graphql/types';

import { ProfileImage } from './elements';

export const UserMenu: FunctionComponent & {
  Button: (props: any) => JSX.Element;
} = props => {
  const {
    modalOpened,
    signOutClicked,
    files: { gotUploadedFiles },
  } = useActions();
  const {
    user,
    activeTeamInfo,
    activeTeam,
    activeWorkspaceAuthorization,
  } = useAppState();

  if (!user) {
    return null;
  }

  const showCurator = user.curatorAt;

  const showBecomePro = !activeTeamInfo?.subscription;
  const showManageSubscription =
    activeTeamInfo?.subscription &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

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
            <Stack align="center" gap={1}>
              <Icon name="profile" size={24} />
              <Text>My Profile</Text>
            </Stack>
          </Menu.Link>

          <Menu.Divider />

          <Menu.Link to={dashboardUrl()}>
            <Stack align="center" gap={1}>
              <Icon name="dashboard" size={24} />
              <Text>Dashboard</Text>
            </Stack>
          </Menu.Link>

          <Menu.Link href="/docs">
            <Stack align="center" gap={1}>
              <Icon name="documentation" size={24} />
              <Text>Documentation</Text>
            </Stack>
          </Menu.Link>

          <Menu.Link to={searchUrl()}>
            <Stack align="center" gap={1}>
              <Icon name="searchBubble" size={24} />
              <Text>Search Sandboxes</Text>
            </Stack>
          </Menu.Link>

          {showCurator && (
            <Menu.Link to={curatorUrl()}>
              <Stack align="center" gap={1}>
                <Icon name="curator" size={24} />
                <Text>Curator Dashboard</Text>
              </Stack>
            </Menu.Link>
          )}

          {showBecomePro && (
            <Menu.Link href="/pro">
              <Stack align="center" gap={1}>
                <Icon name="proBadge" size={24} />
                <Text>Upgrade to Pro</Text>
              </Stack>
            </Menu.Link>
          )}

          <Menu.Divider />

          {showManageSubscription && (
            <Menu.Link href={`/dashboard/settings?workspace=${activeTeam}`}>
              <Stack align="center" gap={1}>
                <Icon name="proBadge" size={24} />
                <Text>Manage Subscription</Text>
              </Stack>
            </Menu.Link>
          )}

          <Menu.Item onClick={() => gotUploadedFiles(null)}>
            <Stack align="center" gap={1}>
              <Icon name="folder" size={24} />
              <Text>Storage Management</Text>
            </Stack>
          </Menu.Item>

          <Menu.Item onClick={() => modalOpened({ modal: 'preferences' })}>
            <Stack align="center" gap={2} paddingLeft={1}>
              <Icon name="gear" size={16} />
              <Text>Preferences</Text>
            </Stack>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item onClick={() => modalOpened({ modal: 'feedback' })}>
            <Stack align="center" gap={1}>
              <Icon name="feedback" size={24} />
              <Text>Submit Feedback</Text>
            </Stack>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item onClick={() => signOutClicked()}>
            <Stack align="center" gap={1}>
              <Icon name="signout" size={24} />
              <Text>Sign out</Text>
            </Stack>
          </Menu.Item>
        </Menu.List>
      </Menu>
    </Element>
  );
};

UserMenu.Button = Menu.Button;
