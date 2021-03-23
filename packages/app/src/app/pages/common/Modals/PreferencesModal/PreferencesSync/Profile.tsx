import React, { useState, useEffect } from 'react';
import { SettingSync } from 'app/overmind/namespaces/preferences/state';
import {
  Text,
  Element,
  ListItem,
  Stack,
  Icon,
  Menu,
  Input,
} from '@codesandbox/components';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import css from '@styled-system/css';
import { format } from 'date-fns';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions } from 'app/overmind';
import { SyncedIcon, OutOfSyncIcon } from './Icons';

export const Profile = ({ setting }: { setting: SettingSync }) => {
  const preferences = useActions().preferences;
  const [rename, setRename] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean | null>(null);
  const [name, setName] = useState<string>(setting.name);

  const renameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await preferences.renameUserSettings({ name, id: setting.id });

      setRename(false);
    } catch {
      setRename(false);
    }
  };

  const checkIfSyncedPrefs = () => {
    const settingFromComputer = localStorage.getItem(`profile-${setting.id}`);
    if (settingFromComputer) {
      const synced = preferences.checkifSynced(setting.settings);
      setIsSynced(synced);
    }
  };

  useEffect(() => {
    checkIfSyncedPrefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListItem
      justify="space-between"
      align="center"
      css={css({
        color: 'sideBar.foreground',
        paddingX: 0,
        paddingY: 2,
        borderBottomWidth: 1,
        borderBottomColor: 'sideBar.border',
        borderBottomStyle: 'solid',
      })}
    >
      {rename ? (
        <Element
          as="form"
          paddingRight={4}
          onSubmit={renameProfile}
          css={css({ width: '100%' })}
        >
          <Input
            required
            value={name}
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </Element>
      ) : (
        <Text>{setting.name}</Text>
      )}

      <Stack gap={2} align="center">
        <span>{format(new Date(setting.updatedAt), 'dd/MM/yyyy')}</span>

        <Element
          css={css({
            width: 6,
            height: 6,
            color: 'button.background',
          })}
        >
          {isSynced ? (
            <Tooltip content="Your local preferences are in sync with the server">
              <SyncedIcon />
            </Tooltip>
          ) : (
            <Tooltip content="Your local preferences are not in sync with the server">
              <OutOfSyncIcon />
            </Tooltip>
          )}
        </Element>
        <Menu>
          <Menu.Button css={{ color: 'white', padding: 0 }}>
            <Icon css={css({ color: 'mutedForeground' })} name="more" />
          </Menu.Button>
          <Menu.List>
            {!isSynced ? (
              <>
                <Menu.Item
                  onSelect={() => {
                    track('Preferences Profiles - Apply Profile');
                    preferences.applyPreferences(setting.settings);
                  }}
                >
                  Apply
                </Menu.Item>
                <Menu.Item
                  onSelect={() => {
                    track('Preferences Profiles - Update Profile');
                    preferences.createPreferencesProfile();
                    setIsSynced(true);
                  }}
                >
                  Update Profile
                </Menu.Item>
                <Menu.Divider />
              </>
            ) : null}
            <Menu.Item onSelect={() => setRename(true)}>Rename</Menu.Item>
            <Menu.Item
              onSelect={() => {
                track('Preferences Profiles - Download Profile');
                preferences.downloadPreferences(setting);
              }}
            >
              Export Profile
            </Menu.Item>
            <Menu.Item
              css={css({ color: 'dangerButton.background' })}
              onSelect={() => {
                track('Preferences Profiles - Delete Profile');
                preferences.deleteUserSetting(setting.id);
              }}
            >
              Delete
            </Menu.Item>
          </Menu.List>
        </Menu>
      </Stack>
    </ListItem>
  );
};
