import React from 'react';
import {
  Text,
  Element,
  List,
  ListItem,
  Stack,
  Icon,
  Menu,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { format } from 'date-fns';
import { useOvermind } from 'app/overmind';

export const Profiles = () => {
  const {
    state: {
      preferences: { settingsSync },
    },
    actions,
  } = useOvermind();
  return (
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
                  <Icon css={css({ color: 'sideBar.border' })} name="more" />
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
    </Element>
  );
};
