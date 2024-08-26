import {
  profileUrl,
  docsUrl,
  csbSite,
} from '@codesandbox/common/lib/utils/url-generator';
import { Menu, Stack, Icon, Text } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { ProfileImage } from './elements';

export const UserMenu: FunctionComponent & {
  Button: (props: any) => JSX.Element;
} = props => {
  const { modalOpened, signOutClicked, gotUploadedFiles } = useActions();
  const { user, environment } = useAppState();

  if (!user) {
    return (
      <Stack>
        <Menu>
          {props.children}
          <Menu.List>
            <Menu.Item
              onClick={() => {
                window.location.href = docsUrl();
              }}
            >
              <Stack align="center" gap={2}>
                <Icon name="documentation" size={16} />
                <Text>Documentation</Text>
              </Stack>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={() => {
                window.open(`${csbSite()}/?from-app=1`);
              }}
            >
              <Stack align="center" gap={2}>
                <Icon name="external" size={16} />
                <Text>codesandbox.io</Text>
              </Stack>
            </Menu.Item>
          </Menu.List>
        </Menu>
      </Stack>
    );
  }

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
                itemId: 'account',
              })
            }
          >
            <Stack align="center" gap={2}>
              <Icon name="gear" size={16} />
              <Text>User settings</Text>
            </Stack>
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              window.location.href = profileUrl(user.username);
            }}
          >
            <Stack align="center" gap={2}>
              <Icon name="profile" size={16} />
              <Text>Profile</Text>
            </Stack>
          </Menu.Item>

          {showStorage && (
            <Menu.Item onClick={() => gotUploadedFiles(null)}>
              <Stack align="center" gap={2}>
                <Icon name="folder" size={16} />
                <Text>Storage</Text>
              </Stack>
            </Menu.Item>
          )}

          <Menu.Divider />

          <Menu.Item
            onClick={() => {
              window.location.href = docsUrl();
            }}
          >
            <Stack align="center" gap={2}>
              <Icon name="documentation" size={16} />
              <Text>Documentation</Text>
            </Stack>
          </Menu.Item>

          <Menu.Item onClick={() => modalOpened({ modal: 'feedback' })}>
            <Stack align="center" gap={2}>
              <Icon name="feedback" size={16} />
              <Text>Feedback</Text>
            </Stack>
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              window.open(`${csbSite()}/?from-app=1`);
            }}
          >
            <Stack align="center" gap={2}>
              <Icon name="external" size={16} />
              <Text>codesandbox.io</Text>
            </Stack>
          </Menu.Item>

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
