import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Combobox, ComboboxInput } from '@reach/combobox';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Input, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';

import { Notifications } from 'app/components/Notifications';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { TeamAvatar } from 'app/components/TeamAvatar';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const actions = useActions();
    const { isFrozen } = useWorkspaceLimits();
    const {
      activeWorkspaceAuthorization,
      hasLogIn,
      user,
      activeTeam,
    } = useAppState();

    return (
      <Stack
        as="header"
        justify="space-between"
        align="center"
        paddingX={4}
        css={css({
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          padding: '16px',
          color: 'titleBar.activeForeground',
        })}
      >
        <Stack align="center" gap={2} css={{ paddingLeft: '4px' }}>
          <Button
            name="menu"
            title="Menu"
            onClick={onSidebarToggle}
            variant="secondary"
            autoWidth
            css={css({ display: ['block', 'block', 'none'] })}
          >
            <Icon name="menu" size={16} />
          </Button>

          <Button
            as={Link}
            to={dashboardUrls.recent(activeTeam)}
            autoWidth
            variant="ghost"
          >
            <LogoIcon width={18} height={18} />
          </Button>
        </Stack>

        <Stack align="center" gap={2}>
          <SearchInputGroup />
          <Button
            variant="secondary"
            disabled={activeWorkspaceAuthorization === 'READ' || isFrozen}
            onClick={() => {
              track('Dashboard - Topbar - Import repository');
              actions.modalOpened({ modal: 'importRepository' });
            }}
            autoWidth
          >
            <Icon name="plus" size={12} css={{ marginRight: '4px' }} />
            Repository
          </Button>

          <Button
            variant="secondary"
            disabled={activeWorkspaceAuthorization === 'READ' || isFrozen}
            onClick={() => {
              track('Dashboard - Topbar - Create Devbox');
              actions.modalOpened({ modal: 'createDevbox' });
            }}
            autoWidth
          >
            <Icon name="plus" size={12} css={{ marginRight: '4px' }} />
            Devbox
          </Button>

          <Button
            variant="secondary"
            disabled={activeWorkspaceAuthorization === 'READ'}
            onClick={() => {
              track('Dashboard - Topbar - Create Sandbox');
              actions.modalOpened({ modal: 'createSandbox' });
            }}
            autoWidth
          >
            <Icon name="plus" size={12} css={{ marginRight: '4px' }} />
            Sandbox
          </Button>

          {hasLogIn && <Notifications dashboard />}

          <UserMenu>
            <Button
              as={UserMenu.Button}
              variant="secondary"
              css={{
                width: '28px',
                borderRadius: '50%',
                overflow: 'hidden',
                padding: 0,
                border: '2px solid transparent',
                transition: 'border 0.125s ease-out',
              }}
            >
              <TeamAvatar
                style={{
                  width: '28px',
                  height: '28px',
                  border: 0,
                }}
                name={user?.name}
                avatar={user?.avatarUrl}
              />
            </Button>
          </UserMenu>
        </Stack>
      </Stack>
    );
  }
);

const SearchInputGroup = () => {
  const { activeTeam } = useAppState();

  const history = useHistory();
  const location = useLocation();

  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get('query') || ''
  );

  const search = (queryString: string) => {
    history.push(dashboardUrls.search(queryString, activeTeam));
  };
  const [debouncedSearch] = useDebouncedCallback(search, 100);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (event.target.value.length >= 1) {
      debouncedSearch(event.target.value);
    }
    if (!event.target.value) {
      history.push(dashboardUrls.sandboxes('/', activeTeam));
    }
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!location.pathname.includes('search')) {
      // navigate from other places on enter
      history.push(dashboardUrls.search(query, activeTeam));
    }
    if (event.which === ENTER) event.currentTarget.blur();
  };

  return (
    <Stack
      align="center"
      css={css({
        display: ['none', 'none', 'flex'],
      })}
    >
      <Combobox
        openOnFocus
        onSelect={() => {
          history.push(dashboardUrls.search(query, activeTeam));
        }}
      >
        <Stack
          align="center"
          css={{
            position: 'relative',
          }}
        >
          <Icon
            name="search"
            size={16}
            className="icon"
            css={{
              position: 'absolute',
              top: '50%',
              left: 6,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#999999',
            }}
          />
          <ComboboxInput
            as={Input}
            value={query}
            onChange={onChange}
            onKeyPress={handleEnter}
            placeholder="Search in workspace"
            icon="search"
            css={{
              paddingLeft: '24px',
              color: '#999999',

              '&::placeholder': {
                color: '#999999',
              },

              '&:focus': {
                color: '#E6E6E6',
              },
            }}
          />
        </Stack>
      </Combobox>
    </Stack>
  );
};
