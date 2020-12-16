import React, { useState } from 'react';
import {
  Text,
  Element,
  List,
  ListItem,
  Stack,
  Icon,
  Menu,
  Input,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { format } from 'date-fns';
import { useOvermind } from 'app/overmind';

export const Profiles = () => {
  const {
    state: {
      preferences: { settingsSync },
    },
  } = useOvermind();

  return (
    <Element paddingTop={4}>
      <List>
        {settingsSync.settings.map(setting => (
          <Profile setting={setting} />
        ))}
      </List>
    </Element>
  );
};

const Profile = ({ setting }) => {
  const { actions } = useOvermind();
  const [rename, setRename] = useState(false);
  const [name, setName] = useState(setting.name);

  const renameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actions.preferences.renameUserSettings({ name, id: setting.id });

      setRename(false);
    } catch {
      setRename(false);
    }
  };

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
        {format(new Date(setting.updatedAt), 'dd/MM/yyyy')}
        <Element />
        <Menu>
          <Menu.Button css={{ color: 'white' }}>
            <Icon css={css({ color: 'mutedForeground' })} name="more" />
          </Menu.Button>
          <Menu.List>
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
