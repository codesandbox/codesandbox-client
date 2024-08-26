import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Link, useHistory } from 'react-router-dom';
import { Combobox, ComboboxInput } from '@reach/combobox';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Input, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';

import { Notifications } from 'app/components/Notifications';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import { SkeletonTextBlock } from 'app/components/Skeleton/elements';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const history = useHistory();
    const actions = useActions();
    const { isFrozen } = useWorkspaceLimits();
    const {
      activeWorkspaceAuthorization,
      hasLogIn,
      user,
      activeTeam,
      activeTeamInfo,
      dashboard,
    } = useAppState();
    const teamDataLoaded = dashboard.teams.length > 0 && activeTeamInfo;

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
        <Stack align="center" gap={1} css={{ paddingLeft: '4px' }}>
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

          <Stack direction="horizontal">
            {teamDataLoaded ? (
              <WorkspaceSelect
                selectedTeamId={activeTeam}
                onSelect={teamId => {
                  actions.setActiveTeam({
                    id: teamId,
                  });

                  history.replace(dashboardUrls.recent(teamId));
                }}
              />
            ) : (
              <Stack
                align="center"
                css={{ width: '100%', paddingLeft: '28px' }}
              >
                <SkeletonTextBlock
                  css={{ width: 120, height: 12, marginLeft: 8 }}
                />
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack align="center" gap={2}>
          <SearchInputGroup />
          <Button
            variant="secondary"
            disabled={activeWorkspaceAuthorization === 'READ' || isFrozen}
            onClick={() => {
              track('Dashboard - Topbar - Import');
              actions.modalOpened({ modal: 'import' });
            }}
            autoWidth
          >
            <Icon name="github" size={16} css={{ marginRight: '4px' }} />
            Import
          </Button>

          <Button
            variant="primary"
            disabled={activeWorkspaceAuthorization === 'READ'}
            onClick={() => {
              track('Dashboard - Topbar - Create');
              actions.modalOpened({ modal: 'create' });
            }}
            autoWidth
          >
            <Icon name="plus" size={12} css={{ marginRight: '4px' }} />
            Create
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

  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get('query') || ''
  );

  const search = (queryString: string) => {
    history.push(dashboardUrls.search(queryString, activeTeam));
  };
  const [debouncedSearch] = useDebouncedCallback(search, 200);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (event.target.value.length >= 1) {
      debouncedSearch(event.target.value);
    }
    if (!event.target.value) {
      history.push(dashboardUrls.recent(activeTeam));
    }
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
            // onKeyPress={handleEnter}
            placeholder="Search in workspace"
            icon="search"
            css={{
              paddingLeft: '24px',
              color: '#999999',
              minWidth: '250px',

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
