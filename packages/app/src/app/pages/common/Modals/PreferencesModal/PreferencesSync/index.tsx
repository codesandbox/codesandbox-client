import React, { FunctionComponent, useEffect } from 'react';
import css from '@styled-system/css';
import { format } from 'date-fns';
import {
  Text,
  Element,
  Button,
  Menu,
  Link,
  List,
  ListItem,
  Stack,
  Icon,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

import { SubContainer } from '../elements';

const NewButton = ({ children, ...props }) => (
  <Button
    variant="link"
    css={css({ color: 'sideBar.foreground' })}
    autoWidth
    {...props}
  >
    <Stack gap={2} align="center">
      <svg width={16} height={16} fill="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0)">
          <path
            fill="#fff"
            d="M8.4 4.14h-.8v3.6H4v.8h3.6v3.6h.8v-3.6H12v-.8H8.4v-3.6z"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0H16V16H0z" />
          </clipPath>
        </defs>
      </svg>
      <span>{children}</span>
    </Stack>
  </Button>
);

export const PreferencesSync: FunctionComponent = () => {
  const {
    state: {
      preferences: { settingsSync },
    },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.preferences.getUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePreferences = () => actions.preferences.syncSettings();

  const uploadPreferences = () => {};

  return (
    <>
      <Stack justify="space-between" align="baseline">
        <Text block marginBottom={6} size={4} variant="muted" weight="bold">
          Preferences Sync
        </Text>
        {settingsSync.settings.length ? (
          <button
            type="button"
            style={{
              padding: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={uploadPreferences}
          >
            <svg width={16} height={14} fill="none" viewBox="0 0 16 14">
              <path
                fill="#fff"
                d="M12.432 2.811a2.334 2.334 0 012.094 2.137A2.667 2.667 0 0113.333 10H9.667V7.204l1.602 1.716 1.462-1.364L8.667 3.2 4.602 7.556 6.064 8.92l1.603-1.716V10H2v-.024a2.334 2.334 0 01-.506-4.487 2.333 2.333 0 012.979-2.59 4.202 4.202 0 017.959-.088zM8 10h1.333v4H8v-4z"
              />
            </svg>
          </button>
        ) : null}
      </Stack>
      {settingsSync.fetching ? (
        <>Getting your latest saved preferences</>
      ) : (
        <SubContainer>
          {!settingsSync.settings.length ? (
            <>
              <Element marginBottom={5}>
                <Text variant="muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  consectetur, nunc facilisis semper convallis, odio nibh
                  egestas sem, vitae pretium mi lacus venenatis{' '}
                  <Link href="#">docs</Link>{' '}
                </Text>
              </Element>
              <Stack gap={5}>
                <NewButton
                  disabled={settingsSync.syncing}
                  onClick={savePreferences}
                >
                  New Profile
                </NewButton>
                <NewButton>Import Profile</NewButton>
              </Stack>
            </>
          ) : (
            <Element paddingTop={4}>
              <List>
                {settingsSync.settings.map(setting => (
                  <ListItem
                    justify="space-between"
                    align="center"
                    css={css({ color: 'sideBar.foreground' })}
                  >
                    <Text>{setting.name}</Text>
                    <Stack gap={2} align="center">
                      {format(new Date(setting.updatedAt), 'dd/MM/yyyy')}
                      <Element />
                      <Menu>
                        <Menu.Button css={{ color: 'white' }}>
                          <Icon
                            css={css({ color: 'sideBar.border' })}
                            name="more"
                          />
                        </Menu.Button>
                        <Menu.List>
                          <Menu.Item onSelect={() => {}}>Rename</Menu.Item>
                          <Menu.Item
                            onSelect={() =>
                              actions.preferences.downloadPreferences(setting)
                            }
                          >
                            Export Profile
                          </Menu.Item>
                          <Menu.Item
                            onSelect={() => {
                              actions.preferences.deleteUserSetting(setting.id);
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.List>
                      </Menu>
                    </Stack>
                  </ListItem>
                ))}{' '}
              </List>
              {/* <Button
               autoWidth
               disabled={settingsSync.syncing}
               onClick={savePreferences}
             >
               Sync
             </Button> */}
            </Element>
          )}

          {/* {settingsSync.settings && (
            <>
              <Text size={4} align="center" weight="bold" paddingTop={4}>
                Your Saved Settings
              </Text>
              {settingsSync.settings.map(setting => (
                <Element marginTop={1}>
                  <Text block>
                    Last Updated at:{' '}
                    {format(new Date(setting.updatedAt), 'dd/MM/yyyy')}
                  </Text>
                  <Button
                    marginTop={2}
                    autoWidth
                    disabled={settingsSync.applying}
                    onClick={openModal}
                  >
                    Apply Preferences
                  </Button>
                </Element>
              ))}
            </>
          )} */}
        </SubContainer>
      )}
    </>
  );
};
