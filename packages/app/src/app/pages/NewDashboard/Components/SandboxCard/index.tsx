import React from 'react';
// import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Stack, Element, Text, Menu, Stats } from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxCard = ({ sandbox, ...props }) => (
  <Stack
    direction="vertical"
    gap={2}
    css={css({
      width: '100%',
      height: 240,
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      overflow: 'hidden',
      transition: 'all ease-in-out',
      transitionDuration: theme => theme.speeds[4],
      ':hover, :focus': {
        transform: 'scale(0.98)',
      },
    })}
    {...props}
  >
    <Element
      as="div"
      css={{
        height: 160,
        backgroundImage: `url(https://codesandbox.io/api/v1/sandboxes/${sandbox.id}/screenshot.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    />
    <Stack justify="space-between" align="center" marginLeft={4}>
      <Text size={3} weight="medium">
        {sandbox.title || sandbox.alias || sandbox.id}
      </Text>
      <Menu>
        <Menu.IconButton name="more" size={9} title="Sandbox options" />
        <Menu.List>
          <Menu.Item onSelect={() => {}}>Show in Folder</Menu.Item>
          <Menu.Item onSelect={() => {}}>Open sandbox</Menu.Item>
          <Menu.Item onSelect={() => {}}>Open sandbox in new tab</Menu.Item>
          <Menu.Item onSelect={() => {}}>Copy sandbox link</Menu.Item>
          <Menu.Item onSelect={() => {}}>Fork sandbox</Menu.Item>
          <Menu.Item onSelect={() => {}}>Export sandbox</Menu.Item>
          <Menu.Item onSelect={() => {}}>Rename sandbox</Menu.Item>
          <Menu.Item onSelect={() => {}}>Make sandbox a template</Menu.Item>
          <Menu.Item onSelect={() => {}}>Delete sandbox</Menu.Item>
        </Menu.List>
      </Menu>
    </Stack>
    <Stack marginX={4}>
      <Stats
        css={css({ fontSize: 2 })}
        sandbox={{
          viewCount: kFormatter(10300),
          likeCount: kFormatter(800),
          forkCount: kFormatter(25),
        }}
      />
    </Stack>
  </Stack>
);

const kFormatter = (num: number): number | string => {
  if (num > 999999) {
    return (num / 1000000).toFixed(1) + 'M';
  }

  if (num > 999) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num;
};
