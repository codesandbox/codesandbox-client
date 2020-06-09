import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useOvermind } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';
import {
  Stack,
  Input,
  Button,
  Link,
  Icon,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const Header = ({ onSidebarToggle }) => {
  const [value, setValue] = useState('');
  const {
    actions: { modalOpened },
  } = useOvermind();

  const history = useHistory();

  const searchQuery = new URLSearchParams(window.location.search).get('query');

  const search = query => history.push(`/new-dashboard/search?query=${query}`);
  const [debouncedSearch] = useDebouncedCallback(search, 250);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (!e.target.value) history.push(`/new-dashboard/all`);
    if (e.target.value.length >= 2) debouncedSearch(e.target.value);
  };

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
      <Link href="/" css={css({ display: ['none', 'none', 'block'] })}>
        <LogoIcon height={24} />
      </Link>
      <IconButton
        name="menu"
        size={18}
        title="Menu"
        onClick={onSidebarToggle}
        css={css({ display: ['block', 'block', 'none'] })}
      />
      <Input
        type="text"
        value={value || searchQuery || ''}
        onChange={onChange}
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
