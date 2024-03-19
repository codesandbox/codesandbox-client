import {
  profileUrl,
  docsUrl,
  csbSite,
  dashboard as dashboardUrls,
} from '@codesandbox/common/lib/utils/url-generator';
import { Menu, Stack, Icon, Text } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useIsEditorPage } from 'app/hooks/useIsEditorPage';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { ProfileImage } from './elements';

export const UserMenu: FunctionComponent & {
  Button: (props: any) => JSX.Element;
} = props => {
  const {
    modalOpened,
    signOutClicked,
    files: { gotUploadedFiles },
  } = useActions();
  const { user, activeTeam, environment } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro, isFree } = useWorkspaceSubscription();
  const isEditorPage = useIsEditorPage();

  if (!user) {
    return (
      <Stack>
        <Menu>
          {props.children}
          <Menu.List>
            <Menu.Link href={docsUrl()}>
              <Stack align="center" gap={2}>
                <Icon name="documentation" size={16} />
                <Text>Documentation</Text>
              </Stack>
            </Menu.Link>
            <Menu.Divider />
            <Menu.Link href={`${csbSite()}/?from-app=1`}>
              <Stack align="center" gap={2}>
                <Icon name="external" size={16} />
                <Text>codesandbox.io</Text>
              </Stack>
            </Menu.Link>
          </Menu.List>
        </Menu>
      </Stack>
    );
  }

  const showBecomePro = isFree && isAdmin && !environment.isOnPrem;
  const showManageSubscription = isPro && isAdmin && !environment.isOnPrem;
  const showStorage = !environment.isOnPrem;

  return (
    <Stack>
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
          <Menu.Item
            onClick={() =>
              modalOpened({
                modal: 'preferences',
                itemId: isEditorPage ? 'appearance' : 'account',
              })
            }
          >
            <Stack align="center" gap={2}>
              <Icon name="gear" size={16} />
              <Text>User settings</Text>
            </Stack>
          </Menu.Item>

          <Menu.Link href={profileUrl(user.username)}>
            <Stack align="center" gap={2}>
              <Icon name="profile" size={16} />
              <Text>Profile</Text>
            </Stack>
          </Menu.Link>

          {showStorage && (
            <Menu.Item onClick={() => gotUploadedFiles(null)}>
              <Stack align="center" gap={2}>
                <Icon name="folder" size={16} />
                <Text>Storage</Text>
              </Stack>
            </Menu.Item>
          )}

          <Menu.Divider />

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

          <Menu.Link href={`${csbSite()}/?from-app=1`}>
            <Stack align="center" gap={2}>
              <Icon name="external" size={16} />
              <Text>codesandbox.io</Text>
            </Stack>
          </Menu.Link>

          <Menu.Divider />

          <Menu.Item onClick={() => signOutClicked()}>
            <Stack align="center" gap={2}>
              <Icon name="signout" size={16} />
              <Text>Sign out</Text>
            </Stack>
          </Menu.Item>
        </Menu.List>
      </Menu>
    </Stack>
  );
};

UserMenu.Button = Menu.Button;
