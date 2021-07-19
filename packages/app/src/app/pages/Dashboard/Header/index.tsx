import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

import { useAppState, useActions } from 'app/overmind';
import {
  Stack,
  Input,
  Button,
  Link,
  Icon,
  IconButton,
  List,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';
import track from '@codesandbox/common/lib/utils/analytics';

import { Notifications } from 'app/components/Notifications';
import { PlusIcon } from 'app/components/CreateNewSandbox/CreateSandbox/Icons';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';

interface HeaderProps {
  onSidebarToggle: () => void;
}

/** poor man's feature flag - to ship the unfinished version */
const SHOW_COMMUNITY_SEARCH = localStorage.SHOW_COMMUNITY_SEARCH;

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const { openCreateSandboxModal } = useActions();
    const {
      activeTeam,
      activeWorkspaceAuthorization,
      personalWorkspaceId,
      user,
    } = useAppState();
    const history = useHistory();

    const [showInviteMembersButton, setShowInviteMembersButton] = useState(
      false
    );
    const experimentPromise = useExperimentResult('dashboard-invite-members');

    useEffect(() => {
      /* Wait for the API */
      experimentPromise.then(experiment => {
        if (experiment === ExperimentValues.A) {
          /**
           * A
           */
          setShowInviteMembersButton(false);
        } else if (experiment === ExperimentValues.B) {
          /**
           * B
           */
          setShowInviteMembersButton(true);
        }
      });
    }, [experimentPromise]);

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

        <SearchInputGroup />

        <Stack align="center" gap={2}>
          {showInviteMembersButton && (
            <Button
              type="button"
              variant="link"
              onClick={() => {
                track('Dashboard - Invite members');

                /* Only for workspaces */
                if (activeTeam !== personalWorkspaceId) {
                  history.push(`${dashboardUrls.teamInvite()}?from-header=1`);
                } else {
                  history.push(
                    `${dashboardUrls.createWorkspace()}?from-header=1`
                  );
                }
              }}
              autoWidth
            >
              <PlusIcon css={css({ marginRight: 2, width: '.8em' })} /> Invite
              members
            </Button>
          )}

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

const SearchInputGroup = () => {
  const { activeTeam } = useAppState();

  const history = useHistory();
  const location = useLocation();

  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get('query') || ''
  );

  const searchType = location.pathname.includes('/discover')
    ? 'COMMUNITY'
    : 'WORKSPACE';

  const search = (queryString: string) => {
    if (searchType === 'COMMUNITY') {
      history.push(dashboardUrls.discoverSearch(queryString, activeTeam));
    } else {
      history.push(dashboardUrls.search(queryString, activeTeam));
    }
  };
  const [debouncedSearch] = useDebouncedCallback(search, 100);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value.length >= 2) debouncedSearch(event.target.value);
    if (!event.target.value) {
      history.push(dashboardUrls.allSandboxes('/', activeTeam));
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
      css={css({
        flexGrow: 1,
        maxWidth: 480,
        display: ['none', 'none', 'block'],
        position: 'relative',
      })}
    >
      <Combobox
        openOnFocus
        onSelect={() => {
          // switch to the other search
          if (searchType === 'COMMUNITY') {
            history.push(dashboardUrls.search(query, activeTeam));
          } else {
            history.push(dashboardUrls.discoverSearch(query, activeTeam));
          }
        }}
      >
        <ComboboxInput
          as={Input}
          value={query}
          onChange={onChange}
          onKeyPress={handleEnter}
          placeholder="Search all sandboxes"
        />
        {SHOW_COMMUNITY_SEARCH && query.length >= 2 && (
          <ComboboxPopover
            css={css({
              zIndex: 4,
              fontFamily: 'Inter, sans-serif',
              fontSize: 3,
            })}
          >
            <ComboboxList
              as={List}
              css={css({
                backgroundColor: 'menuList.background',
                borderRadius: 3,
                boxShadow: 2,
                border: '1px solid',
                borderColor: 'menuList.border',
              })}
            >
              <ComboboxOption
                value={query}
                justify="space-between"
                css={css({
                  outline: 'none',
                  height: 7,
                  paddingX: 2,
                  color: 'list.foreground',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  ':hover, &[aria-selected="true"]': {
                    color: 'list.hoverForeground',
                    backgroundColor: 'list.hoverBackground',
                    cursor: 'pointer',
                  },
                })}
              >
                <span>{query}</span>
                <span>
                  {searchType === 'COMMUNITY' ? 'Workspace' : 'Community'} ⏎
                </span>
              </ComboboxOption>
            </ComboboxList>
            <Text
              size={3}
              variant="muted"
              css={css({
                position: 'absolute',
                width: 'fit-content',
                top: -5,
                right: 0,
                paddingX: 2,
              })}
            >
              {searchType === 'COMMUNITY' ? 'in community' : 'in workspace'} ⏎
            </Text>
          </ComboboxPopover>
        )}
      </Combobox>
    </Stack>
  );
};
