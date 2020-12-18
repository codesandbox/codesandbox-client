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
import { useOvermind } from 'app/overmind';
import { SyncedIcon } from './Icons';

export const Profile = ({ setting }: { setting: SettingSync }) => {
  const { actions } = useOvermind();
  const [rename, setRename] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean | null>(null);
  const [name, setName] = useState<string>(setting.name);

  const renameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actions.preferences.renameUserSettings({ name, id: setting.id });

      setRename(false);
    } catch {
      setRename(false);
    }
  };

  useEffect(() => {
    const settingFromComputer = localStorage.getItem(`profile-${setting.id}`);
    if (settingFromComputer) {
      const synced = actions.preferences.checkifSynced(setting.settings);
      setIsSynced(synced);
    }
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
          })}
        >
          {isSynced && (
            <Tooltip content="Your local preferences are in sync with the server">
              <SyncedIcon />
            </Tooltip>
          )}
        </Element>
        <Menu>
          <Menu.Button css={{ color: 'white' }}>
            <Icon css={css({ color: 'mutedForeground' })} name="more" />
          </Menu.Button>
          <Menu.List>
            <Menu.Item
              onSelect={() =>
                actions.preferences.applyPreferences(setting.settings)
              }
            >
              Apply
            </Menu.Item>
            <Menu.Item onSelect={actions.preferences.createPreferencesProfile}>
              Update profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onSelect={() => setRename(true)}>Rename</Menu.Item>
            <Menu.Item
              onSelect={() => actions.preferences.downloadPreferences(setting)}
            >
              Export Profile
            </Menu.Item>
            <Menu.Item
              css={css({ color: 'dangerButton.background' })}
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
  );
};
