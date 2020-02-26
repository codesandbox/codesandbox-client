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
      <Menu>
        <Text size={2} variant="muted">
          Everyone with link
        </Text>{' '}
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
    <Stack justify="flex-end" align="center" css={{ '> *': { lineHeight: 1 } }}>
      <Menu>
        <Menu.Button
          css={{
            [selected !== options[0] && 'color']: 'blues.500',
          }}
        >
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1C14 1.55228 13.5523 2 13 2H1C0.447716 2 0 1.55228 0 1ZM2 5C2 4.44772 2.44772 4 3 4H11C11.5523 4 12 4.44772 12 5C12 5.55228 11.5523 6 11 6H3C2.44772 6 2 5.55228 2 5ZM5 8C4.44772 8 4 8.44771 4 9C4 9.55229 4.44772 10 5 10H9C9.55228 10 10 9.55229 10 9C10 8.44771 9.55228 8 9 8H5Z"
              fill="currentColor"
            />
          </svg>
        </Menu.Button>
        <Menu.List>
          {options.map(option => (
            <Menu.Item onSelect={() => select(option)}>{option}</Menu.Item>
          ))}
        </Menu.List>
      </Menu>
    </Stack>
  );
};
