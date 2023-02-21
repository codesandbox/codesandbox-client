import React, { useState } from 'react';
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
  Icon,
  IconButton,
  List,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';

import { Notifications } from 'app/components/Notifications';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

interface HeaderProps {
  onSidebarToggle: () => void;
}

/** poor man's feature flag - to ship the unfinished version */
const SHOW_COMMUNITY_SEARCH = localStorage.SHOW_COMMUNITY_SEARCH;

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle }) => {
    const { openCreateSandboxModal } = useActions();
    const { activeWorkspaceAuthorization, hasLogIn } = useAppState();

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
        <IconButton
          name="menu"
          size={16}
          title="Menu"
          onClick={onSidebarToggle}
          css={css({ display: ['block', 'block', 'none'] })}
        />

        <div>
          <UserMenu
            css={css({
              display: ['none', 'none', 'block'],
            })}
          >
            <Button
              as={UserMenu.Button}
              variant="link"
              css={css({
                marginLeft: '2px',
                transition: 'color .3s',

                '.chevron': {
                  transition: 'transform .3s',
                },

                '&:hover': {
                  '.chevron': {
                    transform: 'translateY(2px)',
                  },
                },
              })}
            >
              <LogoIcon
                width={18}
                height={18}
                css={css({
                  marginRight: '8px',
                })}
              />
              <Icon
                className="chevron"
                name="chevronDown"
                size={6}
                title="User actions"
              />
            </Button>
          </UserMenu>
        </div>

        <SearchInputGroup />

        <Stack align="center" gap={2}>
          <Button
            variant="ghost"
            css={css({ width: 'auto' })}
            disabled={activeWorkspaceAuthorization === 'READ'}
            onClick={() => {
              openCreateSandboxModal({});
            }}
          >
            <Icon
              name="plus"
              size={22}
              title="New"
              css={css({ paddingRight: 2 })}
            />
            Create
          </Button>

          <Button
            variant="ghost"
            autoWidth
            onClick={() => {
              window.open('http://codesandbox.io/discover', '_blank');
            }}
          >
            <Icon
              name="discover"
              size={22}
              title="New"
              css={{ paddingRight: 2 }}
            />
            Discover
          </Button>

          {hasLogIn && <Notifications dashboard />}
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
        width: 320,
        display: ['none', 'none', 'flex'],
        position: 'fixed',
        left: '288px',
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
        <Stack
          align="center"
          css={css({
            position: 'relative',
          })}
        >
          <Icon
            name="search"
            size={16}
            title="Search"
            className="icon"
            css={css({
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#999999',
            })}
          />
          <ComboboxInput
            as={Input}
            value={query}
            onChange={onChange}
            onKeyPress={handleEnter}
            placeholder="Search"
            icon="search"
            css={css({
              background: 'transparent',
              border: 'none',
              paddingLeft: '24px',
              color: '#999999',

              '&::placeholder': {
                color: '#999999',
                transition: 'color .3s',
              },

              '&:hover': {
                '&::placeholder': {
                  color: '#ffffff',
                },
              },

              '&:focus': {
                '&::placeholder': {
                  color: '#717171',
                },
              },
            })}
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
        </Stack>
      </Combobox>
    </Stack>
  );
};
