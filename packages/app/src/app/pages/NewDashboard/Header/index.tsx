import React from 'react';
import { useOvermind } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';
import {
  Stack,
  Input,
  Button,
  Icon,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const Header = () => {
  const {
    actions: { modalOpened },
  } = useOvermind();

  return (
    <Stack
      as="header"
      justify="space-between"
      align="center"
      paddingX={4}
      css={css({
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        height: 12,
        backgroundColor: 'titleBar.activeBackground',
        color: 'titleBar.activeForeground',
        borderBottom: '1px solid',
        borderColor: 'titleBar.border',
      })}
    >
      <IconButton name="menu" size={18} title="Menu" />
      <Input
        type="text"
        placeholder="Search all sandboxes"
        css={css({ maxWidth: 480, display: ['none', 'none', 'block'] })}
      />
      <Stack align="center" gap={2}>
        <Button
          variant="primary"
          css={css({ width: 'auto', paddingX: 3 })}
          onClick={() => modalOpened({ modal: 'newSandbox' })}
        >
          Create Sandbox
        </Button>
        <Button variant="secondary" css={css({ size: 26 })}>
          <Icon name="bell" size={11} title="Notifications" />
        </Button>
        <UserMenu>
          <Button variant="secondary" css={css({ size: 26 })}>
            <Icon name="more" size={12} title="User actions" />
          </Button>
        </UserMenu>
      </Stack>
    </Stack>
  );
};
