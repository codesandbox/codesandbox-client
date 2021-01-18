import React from 'react';
import { Menu, MenuStyles } from '.';
import { Element } from '../Element';
import { Icon } from '../Icon';
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
      <MenuStyles />
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
      <MenuStyles />
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

export const ContextMenu = () => {
  const [visible, setVisibility] = React.useState(false);
  const [position, setPosition] = React.useState({ x: null, y: null });

  const onContextMenu = event => {
    event.preventDefault();
    setVisibility(true);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const onKeyDown = event => {
    if (event.keyCode !== 18) return; // ALT

    setVisibility(true);
    const rect = event.target.getBoundingClientRect();
    setPosition({ x: rect.right, y: rect.bottom });
  };

  return (
    <Stack>
      <MenuStyles />
      <Element
        tabIndex={0}
        onContextMenu={onContextMenu}
        onKeyDown={onKeyDown}
        css={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          margin: 20,
          padding: 40,
          backgroundColor: '#242424',
        }}
      >
        right click on me
      </Element>
      <Menu.ContextMenu
        visible={visible}
        setVisibility={setVisibility}
        position={position}
      >
        <Menu.Item onSelect={() => {}}>A</Menu.Item>
        <Menu.Item onSelect={() => {}}>B</Menu.Item>
        <Menu.Item onSelect={() => {}}>C</Menu.Item>
        <Menu.Item onSelect={() => {}}>D</Menu.Item>
      </Menu.ContextMenu>
    </Stack>
  );
};

export const MenuWithLinks = () => (
  <>
    <MenuStyles />
    <Menu>
      <Menu.IconButton name="more" />
      <Menu.List>
        <Menu.Link href="/docs">
          <Stack align="center">
            <Icon name="bell" />
            Menu Link with Icon
          </Stack>
        </Menu.Link>
        <Menu.Item>Menu Item</Menu.Item>
        <Menu.Link href="/internal">
          <Stack align="center">Menu Link</Stack>
        </Menu.Link>
      </Menu.List>
    </Menu>
  </>
);

export const DefaultOpen = () => (
  <>
    <MenuStyles />
    <Menu defaultOpen>
      <Menu.Button variant="primary">Open Menu</Menu.Button>
      <Menu.List>
        <Menu.Item>Menu Item</Menu.Item>
        <Menu.Item>Menu Item</Menu.Item>
        <Menu.Item>Menu Item</Menu.Item>
      </Menu.List>
    </Menu>
  </>
);
