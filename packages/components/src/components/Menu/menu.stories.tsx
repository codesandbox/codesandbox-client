import React from 'react';

import { Menu } from '.';
import { Element } from '../Element';
import { Stack } from '../Stack';
import { Text } from '../Text';

export default {
  title: 'components/Menu',
  component: Menu,
};

export const Access = () => {
  const permissions = ['Can View', 'Can Edit', 'Can Comment'];
  const [selected, select] = React.useState(permissions[0]);

  return (
    <Stack justify="flex-end" align="center" css={{ '> *': { lineHeight: 1 } }}>
      <Text size={2} variant="muted">
        Everyone with link
      </Text>{' '}
      <Menu>
        <Menu.Button css={{ color: 'white' }}>
          {selected}{' '}
          <Element
            as="svg"
            marginLeft={2}
            width="7"
            height="4"
            viewBox="0 0 7 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.95023 4L0.90033 1.23979e-06L7 7.15256e-07L3.95023 4Z"
              fill="currentColor"
            />
          </Element>
        </Menu.Button>
        <Menu.List>
          {permissions.map(permission => (
            <Menu.Item onSelect={() => select(permission)}>
              {permission}
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu>
    </Stack>
  );
};

export const IconButton = () => {
  const options = ['All', 'Open', 'Resolved', 'Mentions'];
  const [selected, select] = React.useState(options[0]);

  return (
    <Stack align="center" css={{ '> *': { lineHeight: 1 } }}>
      <Menu>
        <Menu.IconButton
          name="filter"
          css={{
            [selected !== options[0] && 'color']: 'blues.500',
          }}
        />
        <Menu.List>
          {options.map(option => (
            <Menu.Item onSelect={() => select(option)}>{option}</Menu.Item>
          ))}
        </Menu.List>
      </Menu>
    </Stack>
  );
};
