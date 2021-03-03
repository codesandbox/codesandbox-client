import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAppState, useActions } from 'app/overmind';
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

import { Notifications } from 'app/components/Notifications';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const [value, setValue] = useState('');
    const { openCreateSandboxModal } = useActions();
    const { user, activeTeam, activeWorkspaceAuthorization } = useAppState();

    const history = useHistory();

    const searchQuery = new URLSearchParams(window.location.search).get(
      'query'
    );

    const search = (query: string) =>
      history.push(dashboardUrls.search(query, activeTeam));

    const [debouncedSearch] = useDebouncedCallback(search, 100);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);

      if (!e.target.value)
        history.push(dashboardUrls.allSandboxes('/', activeTeam));
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
        <Link
          href="/?from-app=1"
          as="a"
          css={css({ display: ['none', 'none', 'block'] })}
        >
          <LogoIcon
            style={{
              marginLeft: -6, // Logo positioning tweak
            }}
            height={24}
          />
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
            disabled={activeWorkspaceAuthorization === 'READ'}
            onClick={() => {
              openCreateSandboxModal({});
            }}
          >
            Create Sandbox
          </Button>

          {user && <Notifications />}

          <UserMenu>
            <Button
              as={UserMenu.Button}
              variant="secondary"
              css={css({ size: 26 })}
            >
              <Icon name="more" size={12} title="User actions" />
            </Button>
          </UserMenu>
        </Stack>
      </Stack>
    );
  }
);
