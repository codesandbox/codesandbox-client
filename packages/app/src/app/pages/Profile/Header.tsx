import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { useHistory, useLocation } from 'react-router-dom';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { UserMenu } from 'app/pages/common/UserMenu';
import { Stack, Input, Button, Link, Icon } from '@codesandbox/components';
import css from '@styled-system/css';

import { Notifications } from 'app/components/Notifications';

export const Header: React.FC = () => {
  const {
    modalOpened,
    profile: { searchQueryChanged },
  } = useActions();
  const {
    user,
    profile: { searchQuery },
  } = useAppState();
  const history = useHistory();
  const location = useLocation();
  if (!location.search) searchQueryChanged('');

  return (
    <Stack
      as="header"
      justify="space-between"
      align="center"
      paddingX={4}
      gap={4}
      css={css({
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        minHeight: 12,
        backgroundColor: 'sideBar.background',
        color: 'sideBar.foreground',
      })}
    >
      <Link href="/?from-app=1">
        <LogoIcon
          style={{
            marginLeft: -6,
            marginTop: 2, // Logo positioning tweak
          }}
          height={18}
        />
      </Link>

      <Stack align="center" css={css({ display: ['none', 'flex', 'flex'] })}>
        <Icon
          name="search"
          size={12}
          css={css({
            marginRight: '-20px !important',
            zIndex: 2,
            color: 'grays.300',
          })}
        />
        <Input
          type="text"
          placeholder="Search"
          css={css({
            paddingLeft: 7,
            width: [0, 280, 280],
          })}
          value={searchQuery}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const query = event.target.value;
            searchQueryChanged(query);

            if (!query.length) {
              history.push('');
              return;
            }

            if (history.location.pathname === '/search') {
              history.replace('/search?query=' + query);
            } else {
              history.push('/search?query=' + query);
            }
          }}
        />
      </Stack>

      <Stack align="center" gap={2}>
        <Button
          variant="secondary"
          css={css({ width: 'auto', paddingX: 3 })}
          onClick={() => {
            modalOpened({ modal: 'create' });
          }}
        >
          <Icon
            name="plus"
            size={20}
            title="Create New"
            css={css({ paddingRight: 2 })}
          />
          Create
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
};
