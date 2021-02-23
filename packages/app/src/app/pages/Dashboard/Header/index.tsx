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
  Switch,
  List,
  ListAction,
} from '@codesandbox/components';
import css from '@styled-system/css';

import { Notifications } from 'app/components/Notifications';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const [value, setValue] = useState(
      new URLSearchParams(window.location.search).get('query') || ''
    );
    const [global, setGlobal] = useState(
      new URLSearchParams(window.location.search).has('global')
    );

    const {
      actions: { openCreateSandboxModal },
      state: { user, activeTeam, activeWorkspaceAuthorization },
    } = useOvermind();

    const history = useHistory();

    const search = (query: string) =>
      history.push(dashboardUrls.search(query, activeTeam, global));

    const [debouncedSearch] = useDebouncedCallback(search, 100);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);

      if (!e.target.value)
        history.push(dashboardUrls.allSandboxes('/', activeTeam));
      if (e.target.value.length >= 2) debouncedSearch(e.target.value);
    };

    const toggleGlobal = () => {
      const newValue = !global;
      setGlobal(newValue);
      history.push(dashboardUrls.search(value, activeTeam, newValue));
    };

    const [globalSwitchVisible, setGlobalSwitchVisibility] = React.useState(
      false
    );

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
        <Stack
          css={css({
            flexGrow: 1,
            maxWidth: 480,
            display: ['none', 'none', 'block'],
            position: 'relative',
          })}
        >
          <Input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Search all sandboxes"
          />
          <List
            css={css({
              position: 'absolute',
              width: '100%',
              zIndex: 4,
              backgroundColor: 'menuList.background',
              borderRadius: 3,
              boxShadow: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'menuList.border',
              fontSize: 3,
            })}
          >
            <ListAction>in your workspace</ListAction>
            <ListAction>all of CodeSandbox</ListAction>
          </List>
        </Stack>

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
