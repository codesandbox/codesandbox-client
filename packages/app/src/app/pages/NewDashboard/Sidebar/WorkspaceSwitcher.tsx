import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import {
  Link,
  Avatar,
  Text,
  Menu,
  Stack,
  Icon,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { SIDEBAR_WIDTH } from './constants';

interface WorkspaceSwitcherProps {
  activeAccount: {
    username: string | null;
    avatarUrl: string | null;
  };
  inTeamContext: boolean;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = React.memo(
  ({ activeAccount }) => {
    const { state, actions } = useOvermind();
    const { user, dashboard } = state;
    const history = useHistory();

    const inTeamContext =
      activeAccount && user && activeAccount.username !== user.username;

    if (!user) {
      return null;
    }

    return (
      <Stack
        css={css({
          width: '100%',
          height: '100%',
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Menu>
          <Stack
            as={Menu.Button}
            justify="space-between"
            align="center"
            css={css({
              width: SIDEBAR_WIDTH - 32,
              height: '100%',
              paddingLeft: 2,
              borderRadius: 0,
            })}
          >
            <Stack as="span" align="center">
              <Stack
                as="span"
                css={css({ width: 10 })}
                align="center"
                justify="center"
              >
                {activeAccount.avatarUrl ? (
                  <Avatar user={activeAccount} css={css({ size: 6 })} />
                ) : (
                  <TeamAvatar name={activeAccount.username} />
                )}
              </Stack>
              <Text size={4} weight="normal" maxWidth={140}>
                {activeAccount.username}
              </Text>
            </Stack>
            <Icon name="caret" size={8} />
          </Stack>
          <Menu.List
            css={css({
              width: SIDEBAR_WIDTH,
              marginLeft: 2,
              marginTop: '-4px',
              backgroundColor: 'grays.600',
            })}
            style={{ backgroundColor: '#242424' }} // TODO: find a way to override reach styles without the selector mess
          >
            <Menu.Item
              css={css({
                height: 10,
                textAlign: 'left',
                backgroundColor: 'grays.600',

                '&[data-reach-menu-item][data-component=MenuItem][data-selected]:hover': {
                  backgroundColor: 'grays.500',
                },
              })}
              style={{ paddingLeft: 8 }}
              onSelect={() => {
                actions.setActiveTeam({ id: null });
                track('Dashboard - Change workspace', {
                  dashboardVersion: 2,
                });
              }}
            >
              <Stack align="center" gap={2}>
                <Avatar user={user} css={css({ size: 6 })} />
                <Text size={3}>{user.username} (Personal)</Text>

                {!inTeamContext && <Icon name="simpleCheck" />}
              </Stack>
            </Menu.Item>
            {dashboard.teams.map(team => (
              <Stack
                as={Menu.Item}
                key={team.id}
                align="center"
                gap={2}
                css={css({
                  height: 10,
                  textAlign: 'left',
                  backgroundColor: 'grays.600',

                  '&[data-reach-menu-item][data-component=MenuItem][data-selected]': {
                    backgroundColor: 'grays.500',
                  },
                })}
                style={{ paddingLeft: 8 }}
                onSelect={() => actions.setActiveTeam({ id: team.id })}
              >
                <TeamAvatar name={team.name} size="small" />
                <Text css={css({ width: '100%' })} size={3}>
                  {team.name}
                </Text>

                {activeAccount.username === team.name && (
                  <Icon name="simpleCheck" />
                )}
              </Stack>
            ))}
            <Menu.Divider />
            <Stack
              as={Menu.Item}
              align="center"
              gap={2}
              css={css({
                height: 10,
                textAlign: 'left',
              })}
              style={{ paddingLeft: 8 }}
              onSelect={() => history.push(dashboardUrls.createWorkspace())}
            >
              <Stack
                justify="center"
                align="center"
                css={css({
                  size: 6,
                  borderRadius: 'small',
                  border: '1px solid',
                  borderColor: 'avatar.border',
                })}
              >
                <Icon name="plus" size={10} />
              </Stack>
              <Text size={3}>Create a new workspace</Text>
            </Stack>
          </Menu.List>
        </Menu>

        <Link as={RouterLink} to={dashboardUrls.settings(state.activeTeam)}>
          <IconButton
            name="gear"
            size={8}
            title="Settings"
            css={css({ width: 8, height: '100%', borderRadius: 0 })}
          />
        </Link>
      </Stack>
    );
  }
);
