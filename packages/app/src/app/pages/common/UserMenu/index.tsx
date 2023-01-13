import {
  curatorUrl,
  profileUrl,
  docsUrl,
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
          <Menu.Link href={profileUrl(user.username)}>
            <Stack align="center" gap={2}>
              <Icon name="profile" size={16} />
              <Text>Profile</Text>
            </Stack>
          </Menu.Link>

          <Menu.Link href="http://codesandbox.io/discover">
            <Stack align="center" gap={2}>
              <Icon name="discover" size={16} />
              <Text>Discover</Text>
            </Stack>
          </Menu.Link>

          <Menu.Link href={docsUrl()}>
            <Stack align="center" gap={2}>
              <Icon name="documentation" size={16} />
              <Text>Documentation</Text>
            </Stack>
          </Menu.Link>

          <Menu.Item onClick={() => modalOpened({ modal: 'feedback' })}>
            <Stack align="center" gap={2}>
              <Icon name="feedback" size={16} />
              <Text>Feedback</Text>
            </Stack>
          </Menu.Item>

          {showCurator && (
            <Menu.Link to={curatorUrl()}>
              <Stack align="center" gap={2}>
                <Icon name="curator" size={16} />
                <Text>Curator Dashboard</Text>
              </Stack>
            </Menu.Link>
          )}

          {showBecomePro && (
            <Menu.Link to="/pro">
              <Stack align="center" gap={2}>
                <Icon name="proBadge" size={16} />
                <Text>Upgrade to Pro</Text>
              </Stack>
            </Menu.Link>
          )}

          <Menu.Divider />

          {showManageSubscription && (
            <Menu.Link to={`/dashboard/settings?workspace=${activeTeam}`}>
              <Stack align="center" gap={2}>
                <Icon name="proBadge" size={16} />
                <Text>Subscription</Text>
              </Stack>
            </Menu.Link>
          )}

          <Menu.Item onClick={() => gotUploadedFiles(null)}>
            <Stack align="center" gap={2}>
              <Icon name="folder" size={16} />
              <Text>Storage</Text>
            </Stack>
          </Menu.Item>

          <Menu.Item onClick={() => modalOpened({ modal: 'preferences' })}>
            <Stack align="center" gap={2}>
              <Icon name="gear" size={16} />
              <Text>Preferences</Text>
            </Stack>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Link href="/?from-app=1">
            <Stack align="center" gap={2}>
              <Icon name="external" size={16} />
              <Text>codesandbox.io</Text>
            </Stack>
          </Menu.Link>

          <Menu.Item onClick={() => signOutClicked()}>
            <Stack align="center" gap={2}>
              <Icon name="signout" size={16} />
              <Text>Sign out</Text>
            </Stack>
          </Menu.Item>
        </Menu.List>
      </Menu>
    </Element>
  );
};

UserMenu.Button = Menu.Button;
